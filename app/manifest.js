export default function manifest() {
    return {
        name: "Plutus",
        short_name: "Plutus",
        description: "Financial literacy made simple.",
        start_url: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#0a0a0a",
        theme_color: "#5ebb47",
        icons: [
            {
                src: "/logoblack.png",
                sizes: "2322x2322",
                type: "image/png",
            },
        ],
    }
}