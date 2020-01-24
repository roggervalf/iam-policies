import { Statement, StatementConfig, ConditionResolver } from "./Statement";

export class Role {
  private denyStatements: Statement[];
  private allowStatements: Statement[];
  private conditionResolvers?: ConditionResolver;
  constructor(
    config: StatementConfig[],
    conditionResolvers?: ConditionResolver
  ) {
    const statements = config.map(s => new Statement(s));
    this.allowStatements = statements.filter(s => s.effect === "allow");
    this.denyStatements = statements.filter(s => s.effect === "deny");
    this.conditionResolvers = conditionResolvers;
  }
  can(action: string, resource: string, context?: object): boolean {
    return (
      !this.denyStatements.some(s =>
        s.matches(action, resource, context, this.conditionResolvers)
      ) &&
      this.allowStatements.some(s =>
        s.matches(action, resource, context, this.conditionResolvers)
      )
    );
  }
}
