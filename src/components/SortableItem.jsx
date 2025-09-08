import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Shortcut from './Shortcut';

export function SortableItem({ id, link, icon_url, name, shortcuts, setShortcuts, isEditing, handleDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(isEditing ? listeners : {})}>
      <Shortcut id={id} link={link} icon_url={icon_url} name={name} isEditing={isEditing} shortcuts={shortcuts} setShortcuts={setShortcuts} handleDelete={handleDelete} />
    </div>
  );
}

