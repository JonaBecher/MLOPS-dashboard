"use client";

import Sidebar from "../components/sidebar";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export default function PageWrapper(props:Props) {
    return (
        <Sidebar>
            <div className="py-12 px-20 h-screen overflow-x-scroll">
                {props.children}
            </div>
        </Sidebar>
    )
}
