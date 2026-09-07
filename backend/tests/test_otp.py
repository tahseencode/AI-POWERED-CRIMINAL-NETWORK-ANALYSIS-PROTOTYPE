import unittest
import tempfile
import time
from pathlib import Path
from datetime import datetime, timezone, timedelta

from backend.core.database import DatabaseManager
from backend.core.otp_service import otp_service, OTPPurpose, mask_contact, hash_otp_code, verify_otp_hash

class TestOTPVerification(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_otp_users.db"
        self.db = DatabaseManager(db_path=self.db_path)

    def tearDown(self):
        try:
            self.temp_dir.cleanup()
        except Exception:
            pass

    def test_contact_masking(self):
        self.assertEqual(mask_contact("ak.banerjee@police.wb.gov.in"), "a*********e@police.wb.gov.in")
        self.assertEqual(mask_contact("+919830123456"), "+91 •••• ••• 456")
        self.assertEqual(mask_contact("9830123456"), "98 •••• ••• 456")

    def test_otp_generation_and_hashing(self):
        code = otp_service.generate_numeric_code(6)
        self.assertEqual(len(code), 6)
        self.assertTrue(code.isdigit())

        h, salt = hash_otp_code(code)
        self.assertTrue(verify_otp_hash(code, h, salt))
        self.assertFalse(verify_otp_hash("000000", h, salt))

    def test_create_and_verify_otp_success(self):
        # Create OTP for officer 1234
        dispatch = self.db.create_otp(
            contact_target="+91 98301 23456",
            purpose=OTPPurpose.LOGIN_2FA,
            user_id="1234",
            channel="SMS_SANDES"
        )
        self.assertIn("token_id", dispatch)
        self.assertIn("demo_otp_code", dispatch)
        code = dispatch["demo_otp_code"]

        # Verify with correct code
        res = self.db.verify_otp(
            contact_target_or_user_id="1234",
            otp_code=code,
            purpose=OTPPurpose.LOGIN_2FA
        )
        self.assertTrue(res["valid"])
        self.assertEqual(res["user_id"], "1234")

        # Second verification of same OTP should fail (already used)
        res_repeat = self.db.verify_otp(
            contact_target_or_user_id="1234",
            otp_code=code,
            purpose=OTPPurpose.LOGIN_2FA
        )
        self.assertFalse(res_repeat["valid"])

    def test_verify_otp_invalid_code_and_lockout(self):
        dispatch = self.db.create_otp(
            contact_target="sho.test@police.wb.gov.in",
            purpose=OTPPurpose.LOGIN_2FA,
            user_id="SHO-001"
        )
        token_id = dispatch["token_id"]

        # Attempt with wrong code 5 times
        for attempt in range(1, 5):
            res = self.db.verify_otp("SHO-001", "999999", OTPPurpose.LOGIN_2FA)
            self.assertFalse(res["valid"])
            self.assertIn("Invalid verification code", res["error"])

        # 5th attempt should lock out or exceed max
        res5 = self.db.verify_otp("SHO-001", "999999", OTPPurpose.LOGIN_2FA)
        self.assertFalse(res5["valid"])

    def test_expired_otp_rejection(self):
        # Create OTP with 0 second TTL
        dispatch = self.db.create_otp(
            contact_target="+91 98000 11111",
            purpose=OTPPurpose.REGISTRATION,
            ttl_seconds=-10 # Expired in past
        )
        code = dispatch["demo_otp_code"]

        res = self.db.verify_otp("+91 98000 11111", code, OTPPurpose.REGISTRATION)
        self.assertFalse(res["valid"])
        self.assertIn("expired", res["error"].lower())

    def test_password_reset_via_otp(self):
        # 1. Request reset OTP
        dispatch = self.db.create_otp(
            contact_target="ak.banerjee@police.wb.gov.in",
            purpose=OTPPurpose.PASSWORD_RESET,
            user_id="1234"
        )
        code = dispatch["demo_otp_code"]

        # 2. Reset password
        reset_res = self.db.reset_password_with_otp(
            user_id_or_contact="1234",
            otp_code=code,
            new_password="NewSecretPass@2026"
        )
        self.assertTrue(reset_res["valid"])

        # 3. Authenticate with new password
        auth_new = self.db.authenticate_user("1234", "NewSecretPass@2026")
        self.assertIsNotNone(auth_new)

        # 4. Old password should fail
        auth_old = self.db.authenticate_user("1234", "1234")
        self.assertIsNone(auth_old)

    def test_direct_mobile_otp_authentication(self):
        phone = "+91 98311 87654"
        dispatch = self.db.create_otp(
            contact_target=phone,
            purpose=OTPPurpose.MOBILE_LOGIN
        )
        code = dispatch["demo_otp_code"]

        auth_user = self.db.authenticate_user_by_phone_otp(
            contact_target=phone,
            otp_code=code
        )
        self.assertIsNotNone(auth_user)
        self.assertIn("session_id", auth_user)

    def test_otp_logs_and_stats(self):
        self.db.create_otp("+91 98000 22222", OTPPurpose.LOGIN_2FA, user_id="1234")
        logs = self.db.get_otp_logs(limit=10)
        self.assertGreater(len(logs), 0)

        stats = otp_service.get_gateway_statistics()
        self.assertIn("total_dispatched", stats)
        self.assertIn("gateway_status", stats)

if __name__ == "__main__":
    unittest.main()
