import React, { useState, useRef, useEffect } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  showArrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
  className = "",
  showArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 計算 tooltip 位置
  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();

    // 如果 tooltip 還沒有渲染，使用預估尺寸
    const tooltipWidth = 200; // 預估 tooltip 寬度
    const tooltipHeight = 40; // 預估 tooltip 高度

    let x = 0;
    let y = 0;

    switch (position) {
      case "top":
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.top - tooltipHeight - 8;
        break;
      case "bottom":
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.bottom + 8;
        break;
      case "left":
        x = triggerRect.left - tooltipWidth - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
    }

    // 確保 tooltip 不會超出視窗邊界
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 水平邊界檢查
    if (x < 8) x = 8;
    if (x + tooltipWidth > viewportWidth - 8) {
      x = viewportWidth - tooltipWidth - 8;
    }

    // 垂直邊界檢查
    if (y < 8) y = 8;
    if (y + tooltipHeight > viewportHeight - 8) {
      y = viewportHeight - tooltipHeight - 8;
    }

    setCoords({ x, y });
  };

  // 顯示 tooltip
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  // 隱藏 tooltip
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 當 tooltip 顯示後，重新計算精確位置
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      if (triggerRect) {
        let x = coords.x;
        let y = coords.y;

        // 根據實際 tooltip 尺寸調整位置
        switch (position) {
          case "top":
            x =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.top - tooltipRect.height - 8;
            break;
          case "bottom":
            x =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.bottom + 8;
            break;
          case "left":
            x = triggerRect.left - tooltipRect.width - 8;
            y =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
          case "right":
            x = triggerRect.right + 8;
            y =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
        }

        // 邊界檢查
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x < 8) x = 8;
        if (x + tooltipRect.width > viewportWidth - 8) {
          x = viewportWidth - tooltipRect.width - 8;
        }
        if (y < 8) y = 8;
        if (y + tooltipRect.height > viewportHeight - 8) {
          y = viewportHeight - tooltipRect.height - 8;
        }

        setCoords({ x, y });
      }
    }
  }, [isVisible, position]);

  // 箭頭樣式
  const getArrowStyles = () => {
    const baseStyles = "absolute w-2 h-2 bg-gray-900 transform rotate-45";

    switch (position) {
      case "top":
        return `${baseStyles} bottom-[-4px] left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseStyles} top-[-4px] left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseStyles} right-[-4px] top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseStyles} left-[-4px] top-1/2 -translate-y-1/2`;
      default:
        return baseStyles;
    }
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none ${className}`}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          {content}
          {showArrow && <div className={getArrowStyles()} />}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
