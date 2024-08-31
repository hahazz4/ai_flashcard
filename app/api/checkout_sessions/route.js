import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SEC_KEY);
const formatAmountStripe = (amount) => {
    return Math.round(amount * 100);
}

export async function GET(req){
    return NextResponse.json({ error: "Nice try buddy.." },
        {
            status: 405
        }
    );
}

export async function POST(req) {
    try{
        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pro Subscription',
                    },
                    unit_amount: formatAmountStripe(5), //$5.00
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                    },
                },
                quantity: 1,
              },
            ],
            
            success_url: `${req.headers.get('Referer',)}result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('Referer',)}result?session_id={CHECKOUT_SESSION_ID}`,
        }
        const checkoutSession = await stripe.checkout.sessions.create(params)  
        return NextResponse.json(checkoutSession, {
            status: 200,
        })
    } 
    
    catch (e){
        console.error('Error creating checkout session:', e)
        return new NextResponse(JSON.stringify({ error: { message: e.message } }), {
            status: 500,
        })
    }
}
