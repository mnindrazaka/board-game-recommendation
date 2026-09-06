import { Badge } from "./ui/badge";

export type ComplexityBadgeProps = {
  complexity: "light" | "medium" | "heavy";
};

export function ComplexityBadge(props: ComplexityBadgeProps) {
  let colorClass = "";
  switch (props.complexity) {
    case "light":
      colorClass = "bg-green-500";
      break;
    case "medium":
      colorClass = "bg-yellow-500";
      break;
    case "heavy":
      colorClass = "bg-red-500";
      break;
  }

  return (
    <Badge className={colorClass}>
      {props.complexity.charAt(0).toUpperCase() + props.complexity.slice(1)}
    </Badge>
  );
}
