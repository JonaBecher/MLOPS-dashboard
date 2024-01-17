"use client";

import {DataTableClients} from "../../../components/ui/dataTableClients";
import PageWrapper from "../../../components/pageWrapper";
import * as React from "react";

export default function Page() {
    return <PageWrapper>
            <h1 className="mb-4">Devices</h1>
            <DataTableClients />
        </PageWrapper>
}
