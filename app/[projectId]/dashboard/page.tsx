"use client";

import PageWrapper from "../../../components/pageWrapper";

import dynamic from 'next/dynamic';
const Plot = dynamic(()=> {return import ("react-plotly.js")}, {ssr: false})

import {getProjects, getStats} from "../../../api/project/projectCalls";
import {useQuery} from "react-query";
import {useParams} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../../components/ui/tabs";

export default function Page() {
    let params = useParams();
    let projectId = params.projectId as string;

    const { data, status: stats_status } = useQuery({"queryKey": ['stats', projectId], "queryFn": getStats, refetchInterval:5000 });

    if (stats_status !== "success") return <div/>

    let stats_data = data[0];
    let image_data = data[1];
    let score_data = data[2];

    if (!stats_data) return <div/>
// Function to generate timestamps at one-minute intervals
    function generateTimestamps(start: Date, end: Date): Date[] {
        let timestamps = [];
        let current = new Date(start.getTime());

        // Set seconds and milliseconds of start time to zero
        current.setSeconds(0, 0);

        while (current <= end) {
            timestamps.push(new Date(current));
            current.setMinutes(current.getMinutes() + 1);
            // Set seconds and milliseconds to zero for subsequent timestamps
            current.setSeconds(0, 0);
        }

        return timestamps;
    }

// Set endDate to current timestamp and startDate to 20 minutes before
    const endDate = new Date(new Date().getTime() - (60 * 60 * 1000))
    const startDate = new Date(endDate.getTime() - (20 * 60 * 1000)); // 20 minutes in milliseconds

// Find all unique labels
    console.log(stats_data)
    // @ts-ignore
    const labels = Array.from(new Set(stats_data.map(dataPoint => dataPoint.label || '0')));

// Generate all timestamps for the last 20 minutes
    const allTimestamps = generateTimestamps(startDate, endDate);

// Initialize groupedData with all timestamps and labels set to 0
    const groupedData = allTimestamps.reduce((acc, timestamp) => {
        labels.forEach(label => {
            // @ts-ignore
            if (!acc[label]) {
                // @ts-ignore
                acc[label] = {};
            }
            // @ts-ignore
            acc[label][timestamp] = 0; // Initialize count to 0
        });
        return acc;
    }, {});

// Update groupedData with actual data within the last 20 minutes
    // @ts-ignore
    stats_data.forEach(dataPoint => {
        // @ts-ignore
        const label = dataPoint.label || '0';
        // @ts-ignore
        const timestamp = new Date(dataPoint.timestamp);

        if (timestamp >= startDate && timestamp <= endDate) {
            // @ts-ignore
            groupedData[label][timestamp] = dataPoint.count || 0;
        }
    });
    console.log(groupedData)
// Convert groupedData to plotData format
    const plotData = labels.map(label => ({
        type: 'scatter',
        mode: 'lines',
        name: label,
        // @ts-ignore
        x: Object.keys(groupedData[label]).map(ts => new Date(ts)),
        // @ts-ignore
        y: Object.values(groupedData[label])
    }));


    // @ts-ignore
    return <PageWrapper>
        <h1 className="mb-4">Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Devices
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-muted-foreground">
                            Gesamt
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aktive Devices
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">9</div>
                        <p className="text-xs text-muted-foreground">
                            Gerade
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Erkannte Klassen</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+8</div>
                        <p className="text-xs text-muted-foreground">
                            in den letzten 24 Stunden
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Voerhersagen
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2582</div>
                        <p className="text-xs text-muted-foreground">
                            In den letzten 24 Stunden
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-5">
                    <CardHeader>
                        <CardTitle className={"mb-4"}>Erkannte Klassen</CardTitle>
                        <Plot
                            // @ts-ignore
                            data={plotData}
                            config={{displayModeBar: false}}
                            layout={{
                                showlegend: true,
                                yaxis: { title: 'Anzahl'},
                                xaxis: {showgrid: false},
                                uirevision: 'true',
                                autosize: true,
                                margin: {
                                    l: 60,
                                    r: 60,
                                    b: 45,
                                    t: 0,
                                    pad: 8
                                }
                            }}
                        />
                    </CardHeader>
                    <CardContent className="pl-2">
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Statistiken</CardTitle>
                        <CardDescription className="pt-4">
                            AVG. RGB-Werte:
                        </CardDescription>
                        <div className={"font-medium text-black text-lg"}>
                            <p className={"font-medium text-black text-sm"}>Rot: {image_data["avgRed"][0]} &#177;{image_data["avgRed"][1]}</p>
                            <p className={"font-medium text-black text-sm"}>Grün: {image_data["avgGreen"][0]} &#177;{image_data["avgGreen"][1]}</p>
                            <p className={"font-medium text-black text-sm"}>Blau: {image_data["avgBlue"][0]} &#177;{image_data["avgBlue"][1]}</p>
                        </div>
                    </CardHeader>
                    <CardHeader>
                        <CardDescription>
                            AVG. Label Confidence:
                        </CardDescription>
                        <div className={"font-medium text-black text-lg"}>
                            {Object.keys(score_data).map((key) => (
                                    <p key={key} className="font-medium text-black text-sm">
                                        {/*@ts-ignore*/}
                                        {key}: {score_data[key].mean.toFixed(3)} ±{score_data[key].std.toFixed(3)}
                                    </p>
                                ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
            </Tabs>
    </PageWrapper>

}
