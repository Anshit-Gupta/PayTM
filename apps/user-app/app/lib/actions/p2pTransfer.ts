"use server";
import prisma from "@repo/db/client"
import { authOptions } from "../auth"
import { getServerSession } from "next-auth"
import { timeStamp } from "console";

export async function p2ptransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if(!from)
    {
        return{
            message:"Error while sending"
         }
    }
    const toUser = await prisma.user.findFirst({
        where:{
            number : to
        }
    });
     if(!toUser)
    {
        return{
            message:"User not found"
         }
    }
    await prisma.$transaction(async(tx)=>{   // the reason we are using $transaction and tx here is because we want atomicity -> the entire transaction takes place at once or doesnt happen at all 
        //loacking row in db
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await tx.balance.findUnique({  //before sending we need to check if the sender has enough balance 
            where:{
                userId:Number(from)
            }
        });
        if(!fromBalance || fromBalance.amount < amount){
            throw new Error('Insuficiant funds');
        }
        //now  decrement the balance from the sender
        await tx.balance.update({
            where : {
                userId:Number(from)
            },
            data:{
                amount : {decrement:amount}
            },
        })
         //and   Increment the balance of reciever 
           await tx.balance.update({
            where : {
                userId:Number(toUser.id)
            },
            data:{
                amount : {increment:amount}
            },
           })

         //updateing the log we show on the page 
         await tx.p2pTrasnfer.create({
            data:{
                fromUserId: Number(from) , 
                toUserId : toUser.id,
                amount,
                timeStamp : new Date()
            }
         })


    })


}
