declare module "*.frag" {
  const shader: string;

  export default shader;
}

declare module "*.vert" {
  const shader: string;

  export default shader;
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
