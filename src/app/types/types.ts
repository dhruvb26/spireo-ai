export interface Slide {
  id: number;
  title: string;
  description: string;
  titleStyles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    fontSize: number;
    x: number;
    y: number;
    align: "start" | "middle" | "end";
  };
  descriptionStyles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    fontSize: number;
    x: number;
    y: number;
    align: "start" | "middle" | "end";
  };
  titleColor: string;
  textColor: string;
  backgroundSvg: string;
}
