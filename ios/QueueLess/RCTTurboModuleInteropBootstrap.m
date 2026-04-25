#import <React/RCTBridge.h>

// Ensures TurboModule interop is on before any RN runtime starts (bridgeless + Swift delegate).
__attribute__((constructor))
static void QueueLessRCTTurboModuleInteropBootstrap(void)
{
  RCTEnableTurboModuleInterop(YES);
  RCTEnableTurboModuleInteropBridgeProxy(YES);
}
