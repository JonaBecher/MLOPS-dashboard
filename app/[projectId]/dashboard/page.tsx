"use client";

import PageWrapper from "../../../components/pageWrapper";
import Plot from 'react-plotly.js';

export default function Page() {
    return <PageWrapper>
        <h1 className="mb-4">Dashboard</h1>
        <Plot
            data={[
                {type: 'bar', x: ["Person", "car", "test"], y: [2, 5, 3]},
            ]}
            layout={{}}
            config={{
                displayModeBar: false,
                displaylogo: false
            }}
        />
    </PageWrapper>
}
