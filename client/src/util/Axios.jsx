import axios from 'axios';


export const Axios = axios.create({
    baseURL:"http://localhost:2000",
    withCredentials:true
})

const SummaryAPI = {
    allData:{
        url:"/api/form/get-all-data",
        method:'get'
    },
    storeData:{
        url:"/api/form/post-data",
        method:'post'
    }
}

export default SummaryAPI
