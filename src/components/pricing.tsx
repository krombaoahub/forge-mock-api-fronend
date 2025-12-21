import { PRICINGS } from "@/contants";
import { Check, X } from "lucide-react";
import React, { useCallback, useState } from "react";

type SubscriptionType = 'monthly' | 'annual'

type FeaturesType = {
    feature: string
    include: boolean
    tooltip?: string
}
interface PriceCardInterface {
    type: string,
    price: string
    subText: string
    buttonText: string
    mostPopular?: boolean
    features: FeaturesType[]

}
export const PriceCard: React.FC<PriceCardInterface> = ({ mostPopular = false, ...props }) => {
    return (
        <div className="grow relative hover:shadow-2xl hover:-translate-y-[15px] transition-all duration-300 hover:z-40 max-w-md">
            {mostPopular && <div className="btn btn-primary btn-sm absolute -top-4 z-50 left-1/2 transform -translate-x-1/2 px-5 rounded-full">Most Popular</div>}
            <div className={`${mostPopular ? 'border border-primary' : ''} card bg-primary/10 p-6 grow `}>
                <div className="flex flex-col gap-3">
                    <div className="text-2xl text-center font-bold">{props.type}</div>
                    <div className="text-4xl text-center font-medium">{props.price}{props.price !== '$0' && <><span className="text-sm text-zinc-400">.99/month</span></>}</div>
                    <div className="text-center">{props.subText}</div>
                </div>
                <button className={`btn m-4 ${props.price === '$0' ? 'btn-disabled' : 'btn-primary'}`} onClick={() => { }}>{props.buttonText}</button>
                <div className="flex flex-col gap-3 text-sm">
                    {(props.features).map((item, key) => (
                        <div key={key} className={`flex gap-3 items-center ${!item.include ? 'text-zinc-500' : ''}`}>
                            {!item.include ? <X className='text-zinc-500' size={16} /> : <Check className='text-success' size={16} />}
                            <p>{item.feature}</p>
                            {item.tooltip && <div className="tooltip [--placement:bottom]">
                                <div className="tooltip-toggle">
                                    <span className="icon-[tabler--help] hover:text-primary mt-1.5 size-4"></span>
                                    <div className="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible" role="popover">
                                        <div className="tooltip-body bg-base-100 text-base-content/80 max-w-xs rounded-lg p-4 text-start">
                                            <p>{item.tooltip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    ))}
                </div>
            </div >
        </div >
    )
}

export const Pricing: React.FC = () => {
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('monthly')

    const setSubsType = useCallback((type: SubscriptionType) => {
        setSubscriptionType(type)
    }, [])

    return (
        <section className="w-full [&>div]:max-w-7xl py-10">
            <div className='mx-auto gap-6 flex flex-col'>
                <div className='text-center'>
                    <p className="text-5xl max-w-2xl  mx-auto font-bold m-10">Simple, transparent pricing</p>
                    <p className="text-xl max-w-2xl mx-auto">Choose the plan that fits your needs. All plans include our core features with different usage limits.</p>
                </div>
                <div className='flex justify-bettween border border-secondary/20 rounded-full mx-auto p-1 [&>div.active]:font-bold'>
                    <div onClick={() => setSubsType('monthly')} className={`transition-all rounded-full px-6 py-2 btn border-0 ${subscriptionType == 'monthly' ? 'btn-primary' : 'btn-outline'}`}>Monthly</div>
                    <div onClick={() => setSubsType('annual')} className={`transition-all rounded-full px-6 py-2 btn border-0 ${subscriptionType == 'annual' ? 'btn-primary' : 'btn-outline'}`}>Annual (Save 20%)</div>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center m-6">
                    {PRICINGS.map((item, key) => (
                        <PriceCard key={key} type={item.type}
                            price={item.price[subscriptionType]}
                            subText={item.subText}
                            buttonText={item.buttonText}
                            mostPopular={item.mostPopular}
                            features={item.features} />
                    ))}
                </div>
            </div>
        </section>
    )
}