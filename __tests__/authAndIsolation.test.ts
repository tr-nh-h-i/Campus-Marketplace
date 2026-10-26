import {
  registerAccount,
  authenticateAccount,
  changePassword,
  saveUserCart,
  getUserCart,
  saveUserFavourites,
  getUserFavourites,
  getUserOrders,
  saveUserOrder,
  isUserAdmin,
  SEED_ACCOUNTS,
} from '../services/authStorage';
import { CartItem, Listing } from '../types/marketplace';

describe('Test 4: Xác thực Tài khoản & Cô lập Dữ liệu Người dùng (Multi-User Isolation)', () => {
  const testListing: Listing = {
    id: 'lst_test_101',
    sellerId: 'usr_seller_01',
    sellerName: 'Nguyễn Văn Minh',
    title: 'Giáo trình Lập trình Di động',
    category: 'textbook',
    price: 50000,
    stock: 5,
    photoUri: 'https://test.com/photo.jpg',
    description: 'Sách photo DNTU',
    createdAt: '2026-10-24T00:00:00.000Z',
    condition: 'like_new',
  };

  test('1. Đăng ký tài khoản mới hợp lệ và kiểm tra tính duy nhất của email', async () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newEmail = `sinhvien.${randomSuffix}@dntu.edu.vn`;

    const res = await registerAccount({
      name: 'Sinh Viên Kiểm Thử',
      email: newEmail,
      password: 'password123',
      role: 'buyer',
      studentId: `192305${randomSuffix}`,
      phone: '0901112233',
    });

    expect(res.user.id).toBeDefined();
    expect(res.user.email).toBe(newEmail);
    expect(res.user.role).toBe('buyer');
    expect(res.token).toContain('jwt_campus_');

    // Không cho phép đăng ký trùng email
    await expect(
      registerAccount({
        name: 'Người Trùng Email',
        email: newEmail,
        password: 'password456',
        role: 'seller',
      })
    ).rejects.toThrow('đã được đăng ký trong hệ thống');
  });

  test('2. Xác thực đăng nhập: Đúng mật khẩu thành công, sai mật khẩu bị chặn', async () => {
    const defaultAcc = SEED_ACCOUNTS[0]; // Trịnh Thế Thanh Hải

    // Đăng nhập đúng mật khẩu
    const authSuccess = await authenticateAccount(defaultAcc.email, defaultAcc.password);
    expect(authSuccess.user.email).toBe(defaultAcc.email);
    expect(authSuccess.token).toBeDefined();

    // Đăng nhập sai mật khẩu
    await expect(
      authenticateAccount(defaultAcc.email, 'wrong_password')
    ).rejects.toThrow('Mật khẩu không chính xác');

    // Đăng nhập tài khoản không tồn tại
    await expect(
      authenticateAccount('khongtontai@dntu.edu.vn', 'password123')
    ).rejects.toThrow('Không tìm thấy tài khoản');
  });

  test('3. Đổi mật khẩu tài khoản: Kiểm tra mật khẩu cũ và cập nhật mật khẩu mới', async () => {
    const userToChange = SEED_ACCOUNTS[2]; // Bùi Thanh Sơn (1923050973)

    // Đổi mật khẩu mới
    const changeRes = await changePassword(userToChange.id, 'password123', 'newSecret2026');
    expect(changeRes.success).toBe(true);

    // Xác thực bằng mật khẩu mới
    const authWithNew = await authenticateAccount(userToChange.email, 'newSecret2026');
    expect(authWithNew.user.id).toBe(userToChange.id);

    // Mật khẩu cũ không còn tác dụng
    await expect(
      authenticateAccount(userToChange.email, 'password123')
    ).rejects.toThrow('Mật khẩu không chính xác');

    // Trả lại mật khẩu cũ để không ảnh hưởng các test khác
    await changePassword(userToChange.id, 'newSecret2026', 'password123');
  });

  test('4. Cô lập dữ liệu giỏ hàng và mục yêu thích theo từng tài khoản riêng biệt (Multi-User Isolation)', async () => {
    const userA = 'usr_buyer_1923050080'; // Hải
    const userB = 'usr_buyer_1923050973'; // Sơn

    // User A thêm 2 cuốn sách vào giỏ hàng
    const cartUserA: CartItem[] = [{ listingId: testListing.id, listing: testListing, quantity: 2 }];
    const favsUserA: string[] = ['lst_101', 'lst_102'];
    await saveUserCart(userA, cartUserA);
    await saveUserFavourites(userA, favsUserA);

    // User B thêm 1 cuốn sách khác vào giỏ hàng
    const cartUserB: CartItem[] = [{ listingId: 'lst_103', listing: { ...testListing, id: 'lst_103', title: 'Máy tính Casio' }, quantity: 1 }];
    const favsUserB: string[] = ['lst_103'];
    await saveUserCart(userB, cartUserB);
    await saveUserFavourites(userB, favsUserB);

    // Đọc dữ liệu của User A: Phải đúng dữ liệu của A
    const loadedCartA = await getUserCart(userA);
    const loadedFavsA = await getUserFavourites(userA);
    expect(loadedCartA.length).toBe(1);
    expect(loadedCartA[0].quantity).toBe(2);
    expect(loadedFavsA).toEqual(['lst_101', 'lst_102']);

    // Đọc dữ liệu của User B: Phải đúng dữ liệu của B, không bị trộn lẫn với A
    const loadedCartB = await getUserCart(userB);
    const loadedFavsB = await getUserFavourites(userB);
    expect(loadedCartB.length).toBe(1);
    expect(loadedCartB[0].listingId).toBe('lst_103');
    expect(loadedFavsB).toEqual(['lst_103']);
  });

  test('5. Đúng 3 thành viên nhóm: Hải & Nhật là Admin, Sơn là Người mua thường', async () => {
    expect(SEED_ACCOUNTS.length).toBe(3);

    // Hải & Nhật là Admin
    expect(isUserAdmin(SEED_ACCOUNTS[0])).toBe(true); // Trịnh Thế Thanh Hải
    expect(isUserAdmin(SEED_ACCOUNTS[1])).toBe(true); // Nguyễn Vũ Minh Nhật

    // 1 người làm người thường: Bùi Thanh Sơn (Buyer)
    expect(isUserAdmin(SEED_ACCOUNTS[2])).toBe(false); // Bùi Thanh Sơn
    expect(SEED_ACCOUNTS[2].role).toBe('buyer');

    // Kiểm tra lưu và đọc đơn hàng riêng của User
    const testOrder = {
      id: 'DNTU-ORD-999888',
      userId: SEED_ACCOUNTS[0].id,
      userName: SEED_ACCOUNTS[0].name,
      items: [{ listingId: 'lst_101', quantity: 1, title: 'Sách Di động', price: 65000 }],
      total: 65000,
      status: 'Đã xác nhận',
      createdAt: '2026-10-26 12:00:00',
    };
    await saveUserOrder(SEED_ACCOUNTS[0].id, testOrder);
    const orders = await getUserOrders(SEED_ACCOUNTS[0].id);
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].id).toBe('DNTU-ORD-999888');
  });
});
