import random


class OTPService:

    def __init__(self):
        self.active_otps = {}

    def generate_otp(self, user_id: int) -> str:
        code = str(random.randint(100000, 999999))
        self.active_otps[user_id] = code
        return code

    def verify_otp(self, user_id: int, code: str) -> bool:
        stored_code = self.active_otps.get(user_id)
        if stored_code and stored_code == code:
            del self.active_otps[user_id]
            return True
        return False