export const isSuperAdmin = (email?: string | null) => {
    if (!email) return false;

    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    return email.toLowerCase() === superAdminEmail?.toLowerCase();
};