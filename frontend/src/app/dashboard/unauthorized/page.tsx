export default function UnauthorizedPage() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold text-red-600">
                403 - Unauthorized
            </h1>
            <p className="mt-4">
                You do not have permission to access this page.
            </p>
        </div>
    );
};