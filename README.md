<div dir="rtl" align="right">

# 🏠 Bravo Vendo — Backend

بک‌اند پروژه Vendo (پلتفرم آگهی آنلاین) با Node.js، Express و MongoDB.

---

## 📖 درباره پروژه

این پروژه بک‌اند یک پلتفرم آگهی آنلاین مشابه دیوار است. کاربران می‌توانند ثبت‌نام کنند، آگهی ثبت کنند، دسته‌بندی داشته باشند و عکس آپلود کنند.

این پروژه فقط شامل بک‌اند است. فرانت‌اند آن در مخزن جداگانه‌ای قرار دارد.

---

## 🛠 تکنولوژی‌ها

- Node.js — محیط اجرا
- Express.js — فریم‌ورک وب
- MongoDB — دیتابیس
- Mongoose — ODM
- JWT — احراز هویت
- Swagger — مستندات API
- Multer — آپلود فایل
- Jalali-Moment — تاریخ شمسی

---

## ✨ امکانات

- ورود با کد پیامکی (OTP)
- مدیریت کاربران
- مدیریت دسته‌بندی‌ها (ساختار درختی)
- مدیریت گزینه‌ها (Option برای هر دسته)
- ساخت و حذف آگهی
- آپلود تصاویر
- مستندات API با Swagger
- مدیریت متمرکز خطاها

---

## 📁 ساختار پروژه

Bravo Vendo/
├── public/                  فایل‌های استاتیک
│   └── upload/              تصاویر آپلود شده
├── src/
│   ├── common/
│   │   ├── constant/        ثابت‌ها
│   │   ├── exception/       مدیریت خطاها
│   │   ├── guard/           گاردهای احراز هویت
│   │   ├── messages/        پیام‌ها
│   │   ├── middleware/      میدل‌ورها
│   │   └── utils/           توابع کمکی
│   ├── config/
│   │   ├── mongoose.config.js
│   │   └── swagger.config.js
│   ├── modules/
│   │   ├── auth/            احراز هویت
│   │   ├── user/            کاربران
│   │   ├── category/        دسته‌بندی‌ها
│   │   ├── option/          گزینه‌ها
│   │   └── post/            آگهی‌ها
│   ├── app.routes.js        روتر اصلی
│   └── main.js              نقطه شروع
├── .env
├── .gitignore
├── package.json
└── README.md

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js نسخه ۱۸ یا بالاتر
- MongoDB (لوکال یا Atlas)

### مراحل

۱. مخزن را clone کنید:

git clone https://github.com/hamidreza-babazamani/Bravo-Vendo.git
cd Bravo-Vendo

۲. پکیج‌ها را نصب کنید:

npm install

۳. فایل .env بسازید و این مقادیر را در آن قرار دهید:

PORT=3400
MONGODB_URL=mongodb://localhost:27017/vendo
COOKIE_SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
NODE_ENV=development

۴. سرور را اجرا کنید:

npm start

۵. آدرس سرور:

http://localhost:3400

---

## 📚 مستندات API

پس از اجرای سرور، مستندات Swagger در آدرس زیر در دسترس است:

http://localhost:3400/swagger

---

## 🛣 آدرس‌های API

### 🔐 Auth

- POST /auth/send-otp — ارسال کد پیامکی
- POST /auth/check-otp — تایید کد و ورود
- GET /auth/logout — خروج از حساب

### 👤 User

- GET /user/whoami — دریافت اطلاعات کاربر لاگین‌شده

### 📂 Category

- POST /category — ساخت دسته‌بندی
- GET /category — دریافت همه دسته‌بندی‌ها
- DELETE /category/:id — حذف دسته‌بندی

### ⚙️ Option

- POST /option — ساخت گزینه
- GET /option — دریافت همه گزینه‌ها
- GET /option/:id — دریافت یک گزینه
- PUT /option/:id — ویرایش گزینه
- DELETE /option/:id — حذف گزینه
- GET /option/by-category/:categoryId — گزینه‌های یک دسته (با id)
- GET /option/by-category-slug/:slug — گزینه‌های یک دسته (با slug)

### 📝 Post

- GET / — دریافت همه آگهی‌ها
- POST /post/create — ساخت آگهی جدید
- GET /post/my — آگهی‌های من
- GET /post/:id — دریافت یک آگهی
- DELETE /post/delete/:id — حذف آگهی

---

## 🔒 امنیت

- احراز هویت با JWT ذخیره‌شده در کوکی HttpOnly
- هش کردن داده‌های حساس
- مدیریت CORS
- اعتبارسنجی ورودی‌ها
- مدیریت متمرکز خطاها

---

## ⚠️ نکات مهم

- فایل .env را در GitHub آپلود نکنید
- پوشه node_modules را در GitHub آپلود نکنید
- برای اجرا، ابتدا MongoDB را روشن کنید

---

## 📞 ارتباط

GitHub: https://github.com/hamidreza-babazamani

</div>
