import {ref} from "vue";
import { FetchGet } from "./LoadDisplayMetod";

export let NPList = null
export function ChangeNP(data){
    NPList = data
}
export let OGList = null
export function ChangeOG(data){
    OGList = data
}

export function ClearGlobalData(){
    NPList = ref([])
    OGList = ref([])
}
export async function InitGlobalData(){
    NPList = await FetchGet('/api/v1/earth/get/list', false) || []
    OGList = await FetchGet('/api/v1/constellation/get/list', false) || []
    return
}