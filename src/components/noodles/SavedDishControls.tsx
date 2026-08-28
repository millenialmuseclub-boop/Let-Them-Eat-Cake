import { toggleState, useMyNoodlesEntry } from '../../lib/noodles/useMyNoodles';
import type { MyNoodlesState } from '../../types/noodles/myNoodles';

const STATE_LABELS: Record<MyNoodlesState, string> = {
  'want-to-try': 'Want to Try',
  tried: 'Tried',
  favorite: 'Favorite',
};

export function SavedDishControls({ dishId }: { dishId: string }) {
  const entry = useMyNoodlesEntry(dishId);
  const states = entry?.states ?? [];

  return (
    <div role="group" aria-label="Save this dish" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(Object.keys(STATE_LABELS) as MyNoodlesState[]).map((state) => (
        <button
          key={state}
          type="button"
          className="chip"
          aria-pressed={states.includes(state)}
          onClick={() => toggleState(dishId, state)}
        >
          {STATE_LABELS[state]}
        </button>
      ))}
    </div>
  );
}
