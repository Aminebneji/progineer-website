"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DesktopNavbar = dynamic(() => import("./navbar"));
const MobileNavbar = dynamic(() => import("./mobileNavbar"));

export default function ResponsiveNavbar() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();

        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
