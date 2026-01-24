"use client";

import { useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderContainer() {
    const [isLoading, setIsLoading] = useState(true);

    if (!isLoading) return null;

    return <Preloader onComplete={() => setIsLoading(false)} />;
}
