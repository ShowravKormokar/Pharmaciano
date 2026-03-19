// This page is a dead fallback — middleware handles all redirects from /
// This will only render if middleware is somehow bypassed
import { redirect } from "next/navigation";

export default function HomePage() {
    redirect("/login");
}