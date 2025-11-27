import AppLogo from "./logo";

export default function Footer() {

    return (<footer className="w-full [&>div]:max-w-7xl py-10 bg-black/10">
        <div className='mx-auto gap-6 flex flex-col px-4'>
            <div className="[&>div]:grow [&>div]:w-full flex md:flex-nowrap flex-wrap gap-4">
                <div className='md:max-w-xl max-w-[300opx]'>
                    <AppLogo className="mb-2 font-bold text-md" />
                    <p>The fastest way to create, customize, and deploy mock REST APIs. Trusted by developers worldwide for rapid prototyping and testing.</p>
                </div>
                <div className='flex md:justify-end justify-center gap-6'>
                    <div className='gap-1 flex flex-col'>
                        <p className="mb-2 font-bold text-md">Product</p>
                        <p className="link link-animated hover:text-base-content">Features</p>
                        <p className="link link-animated hover:text-base-content">Pricing</p>
                        <p className="link link-animated hover:text-base-content">API Reference</p>
                        <p className="link link-animated hover:text-base-content">Changelog</p>
                    </div>
                    <div className='gap-1 flex flex-col'>
                        <p className="mb-2 font-bold text-md">Resources</p>
                        <p className="link link-animated hover:text-base-content">Documentation</p>
                        <p className="link link-animated hover:text-base-content">Demo</p>
                    </div>
                </div>
            </div>
            <div className='border-t border-zinc-700/50 py-6 flex flex-wrap  gap-3 justify-between'>
                <p className='text-secondary'>© 2025 ForgeMockAPI All rights reserved.</p>
                <p className='text-secondary'>Status: All systems operational</p>
            </div>
        </div>
    </footer>)
}