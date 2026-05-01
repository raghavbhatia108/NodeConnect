"use client";

import config from "@/rainbowKitConfig";
import {WagmiProvider} from "wagmi";
import { type ReactNode } from "react";
import {RainbowKitProvider, ConnectButton} from "@rainbow-me/rainbowkit";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";

export function Providers({children}:{children:ReactNode}){
    const [queryClient] = React.useState(() => new QueryClient());
return(
    <QueryClientProvider client={queryClient}>
    <WagmiProvider config = {config}>
        <RainbowKitProvider>
            <ConnectButton/>
            {children}
        </RainbowKitProvider>
    </WagmiProvider>
    </QueryClientProvider>
)
}