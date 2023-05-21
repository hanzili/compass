import React, { FC } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { DateCalcs } from "@web/views/Calendar/hooks/grid/useDateCalcs";
import {
  GRID_X_START,
  SIDEBAR_OPEN_WIDTH,
} from "@web/views/Calendar/layout.constants";
import { Measurements_Grid } from "@web/views/Calendar/hooks/grid/useGridLayout";
import { SomedayEventsProps } from "@web/views/Calendar/hooks/draft/useSidebarDraft";
import { WeekProps } from "@web/views/Calendar/hooks/useWeek";
import { GridEventPreview } from "@web/views/Calendar/components/Event/Grid/GridEventPreview/GridEventPreview";
import { StyledWeekSection } from "../../EventsList/styled";
import { WeekEventsColumn } from "./WeekColumn/WeekEventsColumn";

interface Props {
  dateCalcs: DateCalcs;
  measurements: Measurements_Grid;
  somedayProps: SomedayEventsProps;
  viewStart: WeekProps["component"]["startOfView"];
}

export const WeekSection: FC<Props> = ({
  dateCalcs,
  measurements,
  somedayProps,
  viewStart,
}) => {
  const { state, util } = somedayProps;
  const _isDrafting = state.isDraftingExisting || state.isDraftingNew;
  const shouldPreview = _isDrafting && state.isOverGrid && !state.draft.isOpen;
  const gridX = state.mouseCoords.x - (SIDEBAR_OPEN_WIDTH + GRID_X_START);
  const dayIndex = dateCalcs.getDayNumberByX(gridX);

  return (
    <DragDropContext onDragEnd={util.onDragEnd} onDragStart={util.onDragStart}>
      {shouldPreview && (
        <GridEventPreview
          dateCalcs={dateCalcs}
          dayIndex={dayIndex}
          event={state.draft}
          isOverAllDayRow={state.isOverAllDayRow}
          isOverMainGrid={state.isOverGrid}
          measurements={measurements}
          mouseCoords={state.mouseCoords}
          startOfView={viewStart}
        />
      )}
      <StyledWeekSection>
        {state.somedayEvents.columnOrder.map((columnId) => {
          const column = state.somedayEvents.columns[columnId];
          const weekEvents = column.eventIds.map(
            (eventId) => state.somedayEvents.events[eventId]
          );

          return (
            <div key={`${columnId}-wrapper`}>
              <WeekEventsColumn
                column={column}
                draft={state.draft}
                events={weekEvents}
                isDraftingExisting={state.isDraftingExisting}
                isDraftingNew={state.isDraftingNew}
                isOverGrid={state.isOverGrid}
                key={columnId}
                util={util}
              />
            </div>
          );
        })}
      </StyledWeekSection>
    </DragDropContext>
  );
};
