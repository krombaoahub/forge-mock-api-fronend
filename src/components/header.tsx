import AppLogo from "./logo";
import { Link, useLocation } from "react-router-dom";
import { List } from "lucide-react";
import ThemeDropdown from "./theme-dropdown";
import { useEffect, useRef, useState } from "react";
import { useOutsideClickDetector } from "@/hooks/use-click-outside";
import { HSAccordion } from "flyonui/flyonui";
import type { HeaderInterface } from "@/interfaces";
import { useGotoSection } from "@/hooks/use-goto-section";
import { UserDropdownMenu } from "./user-dropdown-menu";
import { useAppSelector } from "@/states/hooks";

type HSAccordionType = HSAccordion | undefined;

export default function Header({ dashboardHeader }: HeaderInterface) {
    const currentUser = useAppSelector((state) => state.app.currentUser);
    const { pathname } = useLocation();
    const formPage = ['/login', '/register'].includes(pathname)
    const [accordionHS, setAccordionHS] = useState<HSAccordionType>(undefined)

    const accordionRef = useRef(null);

    let accordion: HSAccordionType = undefined

    const isClickedOutside = useOutsideClickDetector(accordionRef)

    useEffect(() => {
        if (accordionRef.current) {
            if (accordion == undefined) {
                accordion = new HSAccordion(accordionRef.current)
                setAccordionHS(accordion)
            }
        }
    }, [])

    useEffect(() => {
        if (accordionHS && isClickedOutside) {
            accordionHS.hide()
        }
    }, [isClickedOutside])

    const handleGotoSection = useGotoSection()

    return (
        <header className='w-full [&>.link]:text-white shadow-md p-4 fixed [&>div]:max-w-7xl z-50 bg-base-200/65 backdrop-blur-md ' >
            {dashboardHeader ? <div className='mx-auto gap-5 justify-between items-center lg:flex  hidden'>
                <div className='flex gap-5 items-center'>
                    <AppLogo /></div>
                {!formPage && <div className="flex gap-5 items-center">
                    <div onClick={() => handleGotoSection('featureRef')} className='link link-animated hover:text-base-content'>Features</div>
                    <div onClick={() => handleGotoSection('documentationRef')} className='link link-animated hover:text-base-content'>Documentation</div>
                    <div onClick={() => handleGotoSection('pricingRef')} className='link link-animated hover:text-base-content'>Pricing</div>

                    <UserDropdownMenu />
                </div>}
            </div> : <>

                <div className='mx-auto gap-5 justify-between items-center lg:flex  hidden'>
                    <AppLogo />
                    {
                        !formPage &&
                        <>
                            <div className='flex gap-5'>
                                <div onClick={() => handleGotoSection('featureRef')} className='link link-animated hover:text-base-content'>Features</div>
                                <div onClick={() => handleGotoSection('documentationRef')} className='link link-animated hover:text-base-content'>Documentation</div>
                                <div onClick={() => handleGotoSection('pricingRef')} className='link link-animated hover:text-base-content'>Pricing</div>
                            </div>
                            <div className="flex gap-5 items-center">
                                <Link onClick={() => setTimeout(() => { handleGotoSection('loginRef') }, 100)} to={'/login'} className=' link link-animated hover:text-base-content'>Sign In</Link>
                                <Link onClick={() => setTimeout(() => { handleGotoSection('loginRef') }, 100)} to={'/login'}>
                                    <button className='btn btn-primary'>Get Started Free</button>
                                </Link>

                                <ThemeDropdown />
                            </div>
                        </>
                    }
                </div>
            </>}


            <div className='mx-auto gap-5 justify-between items-center lg:hidden block'>
                <div className="accordion">
                    <div className="accordion-item" ref={accordionRef}>
                        <div className="flex justify-between w-full items-center">
                            <AppLogo />
                            <div>
                                <button className="accordion-toggle inline-flex items-center p-0 gap-x-4 text-start" aria-controls="nav-menu-hamburger" aria-expanded="false" >
                                    <List />
                                </button>
                            </div>
                        </div>
                        <div id="nav-menu-hamburger" className="mt-5 accordion-content hidden w-full overflow-hidden transition-[height] duration-200" aria-labelledby="cancel-basic" role="region" >
                            <div className="px-2 pb-4 flex flex-col gap-2">
                                <div onClick={() => handleGotoSection('featureRef')} className='link link-animated hover:text-base-content'>Features</div>
                                <div onClick={() => handleGotoSection('documentationRef')} className='link link-animated hover:text-base-content'>Documentation</div>
                                <div onClick={() => handleGotoSection('pricingRef')} className='link link-animated hover:text-base-content'>Pricing</div>
                                {
                                    !currentUser ?
                                        <>
                                            <Link onClick={() => setTimeout(() => { handleGotoSection('loginRef') }, 100)} to={'/login'}>
                                                <div className='link link-animated hover:text-base-content'>Get Started Free</div>
                                            </Link>
                                            <Link onClick={() => setTimeout(() => { handleGotoSection('loginRef') }, 100)} to={'/login'} className=' link link-animated hover:text-base-content'>Sign In</Link>
                                            <ThemeDropdown />
                                        </>
                                        : <UserDropdownMenu mobile />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    )
}