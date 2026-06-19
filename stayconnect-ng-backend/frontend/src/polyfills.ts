// Polyfills for React Native compatibility

// DOMException polyfill (required by LiveKit and other WebRTC libraries)
if (typeof global.DOMException === 'undefined') {
  (global as any).DOMException = class DOMException extends Error {
    name: string;
    constructor(message?: string, name?: string) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}

// EventTarget polyfill if needed
if (typeof global.EventTarget === 'undefined') {
  // Simple EventTarget polyfill
  (global as any).EventTarget = class EventTarget {
    private listeners: Map<string, Set<any>> = new Map();

    addEventListener(type: string, callback: any) {
      if (!this.listeners.has(type)) {
        this.listeners.set(type, new Set());
      }
      this.listeners.get(type)!.add(callback);
    }

    removeEventListener(type: string, callback: any) {
      if (this.listeners.has(type)) {
        this.listeners.get(type)!.delete(callback);
      }
    }

    dispatchEvent(event: any) {
      const type = event.type;
      if (this.listeners.has(type)) {
        this.listeners.get(type)!.forEach((callback: any) => callback(event));
      }
      return true;
    }
  };
}

export {};
