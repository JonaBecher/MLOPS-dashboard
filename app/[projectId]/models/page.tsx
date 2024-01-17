"use client";

import PageWrapper from "../../../components/pageWrapper";
import {DataTableModels} from "../../../components/ui/dataTableModels";

export default function Page() {
    return <PageWrapper>
        <h1 className="mb-4">Models</h1>
        <DataTableModels/>
    </PageWrapper>
}
