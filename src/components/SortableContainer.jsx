import React, { useState } from 'react';
import { updateShortcutOrder } from '../middleware/shortcutService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from './SortableItem';
import styles from './SortableContainer.module.css';

export default function ShortcutContainer({ isEditing, shortcuts, setShortcuts, filteredShortcuts, setFilteredShortcuts, handleDelete, userId }) {

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 100 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={shortcuts}
          strategy={rectSortingStrategy}
        >
          {filteredShortcuts.map(shortcut => <SortableItem key={shortcut.id} {...shortcut} shortcuts={shortcuts} setShortcuts={setShortcuts} isEditing={isEditing} handleDelete={handleDelete} />)}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFilteredShortcuts((shortcuts) => {
        const oldIndex = shortcuts.findIndex((shortcut) => shortcut.id === active.id);
        const newIndex = shortcuts.findIndex((shortcut) => shortcut.id === over.id);
        const newItems = arrayMove(shortcuts, oldIndex, newIndex);
        const updated = newItems.map((item, index) => ({ ...item, orderIndex: index }));
        if (userId) {
          updateShortcutOrder(userId, updated);
        }
        else {
          localStorage.setItem('shortcuts', JSON.stringify(updated));
        }
        return updated;
      });
    }
  }
}
