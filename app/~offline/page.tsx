export default function OfflinePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <img src="/SubanenGo.png" alt="SubanenGo" width={96} height={96} className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">You're offline</h1>
                <p className="text-muted-foreground mb-6">
                    Some features are unavailable while you're offline. You can still practice lessons — progress will be synced when you reconnect.
                </p>
            </div>
        </div>
    );
}
