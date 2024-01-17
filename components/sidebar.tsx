"use client";
import {ReactNode, useState} from "react";
import {CaretLeftIcon, DashboardIcon, CubeIcon, LaptopIcon} from '@radix-ui/react-icons'
import {useParams, usePathname, useRouter} from 'next/navigation'
import {getPageNameFromUrl} from "../lib/utils";
import {getProjects} from "../api/project/projectCalls";
import {useQuery} from "react-query";
interface Props {
    children: ReactNode;
}

export default function Sidebar(props:Props) {
    const [open, setOpen] = useState(true);
    let params = useParams();

    let projectId = params.projectId;
    const Menus = [
        {title: "Dashboard", icon: DashboardIcon, gap: false, onclick: ()=>{router.push('/' + projectId + '/dashboard')}},
        {title: "Models", icon: CubeIcon, gap: false, onclick: ()=>{router.push('/' + projectId + '/models')}},
        {title: "Devices", icon: LaptopIcon, gap: false, onclick: ()=>{router.replace('/' + projectId + '/devices')}}
    ];
    const { data: projects_data, status: projects_status } = useQuery({"queryKey": 'projects', "queryFn": getProjects });
    const pathname = usePathname()
    const router = useRouter()
    return (
        <div className="flex">
            <div className={`${open ? "w-72" : "w-28"} p-5 pt-8 h-screen bg-gray-700 relative duration-300`}>
                <div onClick={() => {
                    setOpen(!open)
                }}
                     className={`flex justify-center items-center absolute cursor-pointer -right-5 top-1/2 transform -translate-y-1/2 w-10 border-2 border-white bg-blue-700 h-10 rounded-full ${!open && "rotate-180"}`}>
                    <CaretLeftIcon className="font-bold" color="white" stroke={"4"} width={24} height={24}/>
                </div>
                <div className={`${!open && 'pl-2'} duration-200 flex items-center gap-x-2 max-h-10 cursor-pointer`} onClick={() => router.push('/')}>
                    <div
                        style={{minWidth: "52px", minHeight:"52px"}} className="flex rounded-lg justify-center items-center bg-blue-700 text-white text-xl">
                        E
                    </div>
                    <p className={`origin-left font-medium text-xl text-white duration-200 ${!open && 'scale-0'}`}>dge&nbsp;deploy</p>
                </div>
                <ul className={`pt-10 ${!open && 'pl-2'} duration-200`}>
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            className={`flex rounded-md p-3 cursor-pointer hover:bg-gray-600 text-gray-300 text-sm items-center gap-x-4 ${!open ? "max-w-fit p-3" : "max-w-full"} ${Menu.gap ? "mt-9" : "mt-4"} ${Menu.title.toLowerCase() ===  getPageNameFromUrl(pathname) && "bg-gray-600"} `}
                            onClick={Menu.onclick}
                        >
                            <Menu.icon className="font-bold min-w-7 min-h-7" color="white" stroke={"4"} width={24} height={24}/>
                            <span className={`${!open && "hidden"} origin-left duration-200 font-medium text-lg text-white`}>
                {Menu.title}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-2xl font-semibold flex-1 h-screen">
                {props.children}
            </div>
        </div>
    )
}