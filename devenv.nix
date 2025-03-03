{
  pkgs,
  lib,
  config,
  system,
  ...
}:
{
  name = "jira-issue-generator";

  packages =
    with pkgs;
    lib.flatten [
      git
    ];

  languages = {
    javascript = {
      enable = true;
      package = pkgs.nodejs_22;
      pnpm = {
        enable = true;
        install.enable = true;
      };
    };
  };
}
