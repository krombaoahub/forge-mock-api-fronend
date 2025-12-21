import type React from "react";

const Analytics: React.FC = () => {
    return (
        <>
            Analytics
            <div className="flex items-center gap-3">
                <div>Api-key:</div><div><input className="input" type='password' defaultValue="************" /></div>
            </div>
        </>
    )
}

export default Analytics;