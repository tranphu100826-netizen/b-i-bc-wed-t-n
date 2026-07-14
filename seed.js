// Chạy: node seed.js  (sau khi đã cấu hình .env và MongoDB đang chạy)
// Script này XÓA TOÀN BỘ dữ liệu cũ và tạo lại dữ liệu mẫu để test nhanh.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Food = require('./models/Food');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Đã kết nối MongoDB, bắt đầu seed dữ liệu mẫu...');

  await Promise.all([
    User.deleteMany(),
    Restaurant.deleteMany(),
    Food.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany(),
    Coupon.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Quản trị viên',
    email: 'admin@foodorder.com',
    password: 'admin123',
    role: 'admin',
    phone: '0900000000',
    address: 'Văn phòng NgonNgay, Hà Nội',
  });

  const user1 = await User.create({
    name: 'Nguyễn Văn A',
    email: 'user@foodorder.com',
    password: 'user1234',
    role: 'user',
    phone: '0912345678',
    address: '12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
  });

  const user2 = await User.create({
    name: 'Trần Thị B',
    email: 'user2@foodorder.com',
    password: 'user1234',
    role: 'user',
    phone: '0987654321',
    address: '45 Trần Duy Hưng, Cầu Giấy, Hà Nội',
  });

  const restaurants = await Restaurant.insertMany([
    {
      name: 'Phở Hà Nội',
      description: 'Phở bò, phở gà truyền thống theo công thức gia truyền 3 đời',
      address: '12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
      openHour: '06:00',
      closeHour: '22:00',
    },
    {
      name: 'Pizza Ngon',
      description: 'Pizza và mỳ Ý kiểu Ý, lò nướng củi truyền thống',
      address: '45 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      openHour: '10:00',
      closeHour: '23:00',
    },
    {
      name: 'Bún Chả Hương Liên',
      description: 'Bún chả, nem cua bể chuẩn vị Hà Nội',
      address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội',
      openHour: '10:00',
      closeHour: '21:00',
    },
    {
      name: 'Trà Sữa Full House',
      description: 'Trà sữa, trà trái cây, các loại topping đa dạng',
      address: '8 Chùa Bộc, Đống Đa, Hà Nội',
      openHour: '08:00',
      closeHour: '23:30',
    },
  ]);

  const [phoHN, pizzaNgon, bunCha, traSua] = restaurants;

  const foods = await Food.insertMany([
    // Phở Hà Nội
    { name: 'Phở bò tái', description: 'Phở bò tái chín, nước dùng ninh xương 12 tiếng', price: 45000, category: 'Món chính', restaurant: phoHN._id },
    { name: 'Phở gà', description: 'Phở gà ta, thịt gà xé, hành lá tươi', price: 40000, category: 'Món chính', restaurant: phoHN._id },
    { name: 'Chả cá Lã Vọng', description: 'Chả cá nướng than hoa ăn kèm bún, rau thơm', price: 60000, category: 'Món chính', restaurant: phoHN._id },
    { name: 'Nem rán', description: 'Nem rán giòn nhân thịt, mộc nhĩ, miến', price: 25000, category: 'Khai vị', restaurant: phoHN._id },
    { name: 'Trà đá', description: 'Trà đá miễn phí kèm theo món chính', price: 5000, category: 'Đồ uống', restaurant: phoHN._id },

    // Pizza Ngon
    { name: 'Pizza hải sản', description: 'Pizza phô mai hải sản, đế mỏng giòn', price: 150000, category: 'Pizza', restaurant: pizzaNgon._id },
    { name: 'Pizza pepperoni', description: 'Pizza pepperoni phô mai Mozzarella', price: 135000, category: 'Pizza', restaurant: pizzaNgon._id },
    { name: 'Mỳ Ý sốt bò bằm', description: 'Spaghetti Bolognese sốt cà chua bò bằm', price: 95000, category: 'Mỳ Ý', restaurant: pizzaNgon._id },
    { name: 'Mỳ Ý sốt kem nấm', description: 'Spaghetti sốt kem nấm truffle', price: 105000, category: 'Mỳ Ý', restaurant: pizzaNgon._id },
    { name: 'Salad Caesar', description: 'Salad rau xà lách, ức gà, sốt Caesar', price: 65000, category: 'Khai vị', restaurant: pizzaNgon._id },

    // Bún Chả Hương Liên
    { name: 'Bún chả', description: 'Bún chả thịt nướng than hoa, nước chấm chua ngọt', price: 45000, category: 'Món chính', restaurant: bunCha._id },
    { name: 'Nem cua bể', description: 'Nem cua bể giòn rụm, nhân cua tươi', price: 15000, category: 'Khai vị', restaurant: bunCha._id },
    { name: 'Bún chả combo đặc biệt', description: 'Bún chả + nem cua bể + trà đá', price: 65000, category: 'Combo', restaurant: bunCha._id },

    // Trà Sữa Full House
    { name: 'Trà sữa trân châu đường đen', description: 'Trà sữa truyền thống, trân châu đường đen dẻo', price: 39000, category: 'Đồ uống', restaurant: traSua._id },
    { name: 'Trà đào cam sả', description: 'Trà đào cam sả thanh mát', price: 45000, category: 'Đồ uống', restaurant: traSua._id },
    { name: 'Matcha đá xay', description: 'Matcha Nhật Bản xay đá, kem cheese', price: 49000, category: 'Đồ uống', restaurant: traSua._id },
  ]);

  await Review.create([
    { user: user1._id, restaurant: phoHN._id, rating: 5, comment: 'Phở rất ngon, nước dùng đậm đà!' },
    { user: user2._id, restaurant: phoHN._id, rating: 4, comment: 'Ngon nhưng hơi đông khách giờ trưa' },
    { user: user1._id, restaurant: pizzaNgon._id, rating: 5, comment: 'Pizza đế giòn, phô mai béo ngậy' },
    { user: user2._id, restaurant: bunCha._id, rating: 5, comment: 'Bún chả ngon chuẩn vị Hà Nội' },
    { user: user1._id, restaurant: traSua._id, rating: 4, comment: 'Trà sữa ngon, trân châu dẻo vừa phải' },
  ]);

  for (const r of restaurants) {
    await Review.recalculateRestaurantRating(r._id);
  }

  const coupons = await Coupon.create([
    {
      code: 'CHAOMUNG10',
      description: 'Giảm 10% cho đơn hàng đầu tiên',
      discountType: 'percent',
      discountValue: 10,
      maxDiscountAmount: 30000,
      minOrderAmount: 0,
    },
    {
      code: 'GIAM20K',
      description: 'Giảm ngay 20.000đ cho đơn từ 100.000đ',
      discountType: 'fixed',
      discountValue: 20000,
      minOrderAmount: 100000,
    },
    {
      code: 'FREESHIP',
      description: 'Giảm 15.000đ (tương đương phí ship) cho mọi đơn hàng',
      discountType: 'fixed',
      discountValue: 15000,
      minOrderAmount: 0,
    },
  ]);

  console.log('✅ Seed dữ liệu thành công!');
  console.log('----------------------------------------');
  console.log(`Tài khoản admin : ${admin.email} / admin123`);
  console.log(`Tài khoản user 1: ${user1.email} / user1234`);
  console.log(`Tài khoản user 2: ${user2.email} / user1234`);
  console.log(`Đã tạo ${restaurants.length} nhà hàng, ${foods.length} món ăn, 5 đánh giá mẫu, ${coupons.length} mã giảm giá`);
  console.log(`Mã giảm giá mẫu: ${coupons.map((c) => c.code).join(', ')}`);
  console.log('----------------------------------------');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Lỗi khi seed dữ liệu:', err);
  process.exit(1);
});
