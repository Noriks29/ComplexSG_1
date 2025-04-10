import {ref} from "vue";
import { FetchGet, FetchPost } from "./LoadDisplayMetod";

export let NPList = null
export async function ChangeNP(data, update = true){
    await FetchPost("/api/v1/earth/update/byList", data)
    if(update) NPList = await FetchGet('/api/v1/earth/get/list') || []
    else NPList = data
    return NPList
}
export let OGList = null
export function ChangeOG(data){
    OGList = data
    return OGList
}

export let SystemObject = null
export async function ChangeSystemObject(param, value){
    SystemObject[param] = value
    await FetchPost('/api/v1/system/update', SystemObject, true)
    console.log(SystemObject[param])
    return SystemObject
}
export async function GetSystemObject(){
    SystemObject = await FetchGet('/api/v1/system/get', true) || {}
    return SystemObject
}

export function ClearGlobalData(){
    NPList = ref([])
    OGList = ref([])
    SystemObject = ref({typeWorkplace: -1})
}
export async function InitGlobalData(){
    NPList = await FetchGet('/api/v1/earth/get/list', false) || []
    OGList = await FetchGet('/api/v1/constellation/get/list', false) || []
    SystemObject = await FetchGet('/api/v1/system/get', true) || {}
    return
}