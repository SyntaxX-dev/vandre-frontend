"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = {
  className?: string
  selected?: Date | null
  onSelect?: (date: Date) => void
  mode?: "single" | "range" | "multiple"
  disabled?: (date: Date) => boolean
  fromDate?: Date
  toDate?: Date
}

const Calendar = ({
  className,
  selected,
  onSelect,
  disabled,
}: CalendarProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())
  
  // Array com os nomes dos dias da semana em português
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  
  // Obtém o primeiro e o último dia do mês atual
  const firstDayOfMonth = startOfMonth(currentMonth)
  const lastDayOfMonth = endOfMonth(currentMonth)
  
  // Obtém todos os dias do mês atual
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })
  
  // Obtém os dias da semana anterior que aparecem no primeiro bloco do calendário
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const previousMonthDays = Array.from({ length: startingDayOfWeek }, (_, i) => 
    addDays(firstDayOfMonth, -1 * (startingDayOfWeek - i))
  )
  
  // Obtém os dias do próximo mês que aparecem no último bloco do calendário
  const endingDayOfWeek = lastDayOfMonth.getDay()
  const nextMonthDays = Array.from({ length: 6 - endingDayOfWeek }, (_, i) => 
    addDays(lastDayOfMonth, i + 1)
  )
  
  // Combina os dias do mês anterior, mês atual e mês seguinte
  const calendarDays = [...previousMonthDays, ...daysInMonth, ...nextMonthDays]
  
  // Divide os dias em semanas
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }
  
  // Navega para o mês anterior
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }
  
  // Navega para o próximo mês
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }
  
  // Manipula a seleção de um dia
  const handleSelectDate = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
  }
  
  return (
    <div className={cn("p-3 bg-white border-none", className)}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <h2 className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho com os dias da semana */}
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-muted-foreground text-xs py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Dias do calendário */}
        {calendarDays.map((day, index) => {
          const isSelected = selected ? isSameDay(day, selected) : false
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isDisabled = disabled ? disabled(day) : false
          
          return (
            <button
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground",
                {
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground": isSelected,
                  "text-muted-foreground opacity-50": !isCurrentMonth,
                  "cursor-not-allowed opacity-30": isDisabled,
                }
              )}
              disabled={isDisabled}
              onClick={() => handleSelectDate(day)}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
