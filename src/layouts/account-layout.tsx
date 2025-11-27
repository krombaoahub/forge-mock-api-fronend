import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAppContext } from "@/context/AppContext";
import type React from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export const AccountLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { breadcrumbs } = useAppContext();

    return (
        <div className="flex flex-col w-full mx-auto">
            <Header dashboardHeader />
            <main className="mt-18 min-h-[80dvh]">
                <section className="w-full min-h-[80dvh] [&>div]:max-w-7xl py-10 bg-secondary/15">
                    <div className='mx-auto flex flex-col'>
                        {breadcrumbs && <div className="breadcrumbs">
                            <ul>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <Fragment key={index}>
                                        <li>
                                            {breadcrumb.path ? <Link to={breadcrumb.path}>{breadcrumb.name}</Link> : breadcrumb.name}
                                        </li>
                                        {index < breadcrumbs.length - 1 && <li className="breadcrumbs-separator rtl:rotate-180"><span className="icon-[tabler--chevron-right]"></span></li>}
                                    </Fragment>
                                ))}
                            </ul>
                        </div>}
                        {/* <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="breadcrumbs-separator rtl:rotate-180"><span className="icon-[tabler--chevron-right]"></span></li>
                                <li>
                                    <a href="#">Components</a>
                                </li>
                                <li className="breadcrumbs-separator rtl:rotate-180"><span className="icon-[tabler--chevron-right]"></span></li>
                                <li aria-current="page">Breadcrumb</li>/
                            </ul> 
                        </div>}*/}
                        {children}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )

}