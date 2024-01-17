import axiosClient from "../../lib/axios_client";
import {Project} from "./projectTypes";

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