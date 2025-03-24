// src/components/ui/VirtualizedList.tsx
import React, { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5
}: VirtualizedListProps<T>) {
  // Función para renderizar cada elemento de la lista
  const rowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];
      return <div style={style}>{renderItem(item, index)}</div>;
    },
    [items, renderItem]
  );

  return (
    <div className={`w-full ${className}`} style={{ height: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height || 400} // Altura por defecto si AutoSizer no puede determinarla
            width={width || '100%'}
            itemCount={items.length}
            itemSize={itemHeight}
            overscanCount={overscanCount}
          >
            {rowRenderer}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

export default VirtualizedList;