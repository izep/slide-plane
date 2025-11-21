import { describe, it, expect } from 'vitest';
import { EventBus } from '../utils/EventBus';

describe('EventBus', () => {
  it('registers and emits events', () => {
    let called = 0;
    const handler = () => { called++; };    
    EventBus.on('test-event', handler);
    EventBus.emit('test-event');
    EventBus.emit('test-event');
    expect(called).toBe(2);
    EventBus.off('test-event', handler);
    EventBus.emit('test-event');
    expect(called).toBe(2);
  });
});
