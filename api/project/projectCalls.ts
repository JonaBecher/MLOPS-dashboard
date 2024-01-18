import axiosClient from "../../lib/axios_client";
import {Project} from "./projectTypes";
import {QueryFunctionContext} from 'react-query';

export const getProjects = async () => {
    const { data } = await axiosClient.get(`projects`)

    return data.map((obj:any):Project => {
        return {
            current_modelId: obj.current_modelId,
            name: obj.name,
            version: obj.version,
            id: obj.id.toString()
        }
    })
}

export const getStats = async ({ queryKey }:QueryFunctionContext<[string, string ]>) => {
    const [_, projectId] = queryKey

    let { data } = await axiosClient.get(`${projectId}/getStats`)
    let response = data;
    data = JSON.parse(response["data"])
    const data_obj =  Object.keys(data.label).map(key => {
        const match = key.match(/\('([\d- :]+)', '([\w\s]+)'\)/);
        if (!match) {
            return null;
        }
        const [timestamp, label] = match.slice(1);
        return {
            timestamp,
            label,
            count: data.label[key]
        };
    }).filter(item => item !== null);
    let mean = JSON.parse(response["agg_scores"]["mean"])
    let std = JSON.parse(response["agg_scores"]["std"])
    let combined = {};

    for (let key in mean) {
        // @ts-ignore
        combined[key] = {
            mean: mean[key],
            std: std[key] || 0  // Use || 0 to handle cases where std might not have a corresponding key
        };
    }

    console.log("combined", combined)

    return [data_obj, response["image"], combined]
}