"use server";

import prisma from "@repo/db/client"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function createOnRampTransaction(amount : number , provider : string ){
    //we need the user id , to make changes in the onramp db and create txn history, we wont take userId as pram as it can be security vulnaribility 
    // as hacker can request the backend with fake userid 
    //to get the userid , we will use session
    const token = Math.random().toString(); // this token is sent to the back telling user with this token is coming for this txn , 
    // irl this token come's from bank's backend api (like axios.get("https://hdfc/api/gettoken")) for amput..)  but we are creatting a random one  
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if(!userId){
       return {
        message:"User not logged in"
       }
    }
    await prisma.onRampTransaction.create({
        
        data:{
            userId : Number(userId), // as user id is int in schema 
            amount:amount,
            status:"Processing",
            startTime : new Date(),
            provider,
            token ,

        }
    })

    return{
        message:"on Ramp transaction added"
    }
}