## Category Routes

1. getAllCategories -> endpoint: /category/get -> **GET**
2. getACategoryById -> endpoint: /category/get/:id -> **GET**

## Items or Products Routes

1. getAllItems -> endpoint: /item/get -> **GET**
2. getItemsByName -> endpoint: /item/getByName/:name -> **GET**
3. getItemsByCategory -> endpoint: /item/getByCategory/:category -> **GET**
4. getItemsByTag -> endpoint: /item/getByTag/:tag -> **GET**
5. getItemById -> endpoint: /item/get/:id -> **GET**

## Address Routes

1. getAllAddressesForAUser -> endpoint: /address/user/:userId -> **GET**
2. getAddressById -> endpoint: /address/:addressId -> **GET**

## Branch Routes

1. getAllBranches -> endpoint: /branch/get -> **GET**
2. getBranchById -> endpoint: /branch/get/:id -> **GET**
3. checkBranch (getBranchByName) -> endpoint: /branch/check -> **POST** -> required: **_name_** in body

## Coupons Routes

1. getAllCoupons -> endpoint: /coupon/get -> **GET**
2. getCouponById -> endpoint: /coupon/get/:id -> **GET**
3. validateCoupon -> endpoint: /coupon/validate-coupon -> **POST** -> required: **_couponCode, userId_** in body
4. validateCouponWeb -> endpoint: /coupon/validate-coupon-web -> **POST** -> required: **_couponCode_** in body

## Favorites Routes

1. getAllFavoritesForAUser -> endpoint: /favorite/user -> **Post** -> required: **_platform_** in body
2. getFavoriteById -> endpoint: /favorite/:favoriteId -> **GET**

## BannerSlides Routes

1. getAllSlides -> endpoint: /slide/get -> **GET**
2. getSlideById -> endpoint: /slide/getById/:sliceId -> **GET**
3.

## AuthRoutes

1. registerUser -> endpoint: /auth/register -> **POST** -> required: **_email, password, name, phone, platform_** in body
   <br/>
   <br/>
2. checkVerification -> endpoint: /auth/check-verification/:id(userId) -> **GET**
   <br/>
   <br/>
3. sendEmailVerification -> endpoint: /auth/send-email-verification/:id(userId) -> **POST**
   <br/>
   <br/>
4. sendEmailVerificationLogin -> endpoint: /auth/send-email-verification-login/:id(userId) -> **POST** -> required: **_email_** in body
   <br/>
   <br/>
5. login -> endpoint: /auth/login -> **POST** -> required: **_email, password, platform_** in body
   <br/>
   <br/>
6. checkPhoneExists -> endpoint: /auth/check-phone-exists -> **POST** -> required: **_phone_** in body
   <br/>
   <br/>
7. updatePhoneWeb -> endpoint: /auth/update-phone-web -> **POST** -> required: **_phone(updatedPhone)_** in body
   <br/>
   <br/>
8. loginByPhone -> endpoint: /auth/loginByPhone -> **POST** -> required: **_phone, platform_** in body
   <br/>
   <br/>
9. updateProfile -> endpoint: /auth/profile -> **POST** -> required: **_name, email, phone, userid, optionalImageUpload_** in body
   <br/>
   <br/>
10. deleteProfile -> endpoint: /auth/delete/:id(userId) -> **POST**
    <br/>
    <br/>
11. updatePassword -> endpoint: /auth/update-password -> **PUT** -> required: **_oldPassword, newPassword, userId, email_** in body
    <br/>
    <br/>
12. forgotPassword -> endpoint: /auth/forgot -> **POST** -> required: **_emailfb, npass, platform_** in body
    <br/>
    <br/>
13. getUserDeleteStatus -> endpoint: /auth/get-user-delete-status/:id(userId) -> **GET**
    <br/>
    <br/>
14. getLoginStatus -> endpoint: /login_status -> **GET**
    <br/>
    <br/>
15. logout -> endpoint: /logout -> **GET**
    <br/>
    <br/>
16. checkUser -> endpoint: /check-user -> **GET**
    <br/>
    <br/>
17. sendOtp -> endpoint: /send-otp -> **POST** -> required: **_phoneNumber, otp_** in body
    <br/>
    <br/>
18. sendCode -> endpoint: /send-code -> **POST** -> required: **_email_** in body
