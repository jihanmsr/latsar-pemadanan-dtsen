import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Password lama dan password baru wajib diisi' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 8 karakter' }, { status: 400 });
    }

    // Gunakan email (bukan id) untuk menghindari masalah integer overflow dari NIP
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Password lama tidak sesuai' }, { status: 401 });
    }

    // Pastikan password baru BERBEDA dari password lama
    const isSamePassword = await bcrypt.compare(newPassword, dbUser.password);
    if (isSamePassword) {
      return NextResponse.json({ success: false, message: 'Password baru tidak boleh sama dengan password lama' }, { status: 400 });
    }

    // Enkripsi password baru dan update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email: user.email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('[/api/auth/change-password] Error:', err);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
