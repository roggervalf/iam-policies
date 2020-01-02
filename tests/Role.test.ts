import { Role } from "../src/Role";

it("can create role", () => {
  expect(
    () =>
      new Role([
        {
          resource: "some:glob:*:string/wqweqw",
          action: ["read", "write"],
        },
      ])
  ).not.toThrow();
});

it("can match some resources and not others", () => {
  const role = new Role([
    {
      resource: ["books:horror:*"],
      action: ["read"],
    },
  ]);
  expect(role.can("read", "books:horror:The Call of Cthulhu")).toBe(true);
  expect(role.can("read", "books:fantasy:Brisingr")).toBe(false);
  expect(role.can("write", "books:horror:The Call of Cthulhu")).toBe(false);
});

it("can match based on context", () => {
  const role = new Role([
    {
      resource: ["secrets:${user.id}:*"],
      action: ["read", "write"],
    },
    {
      resource: ["secrets:${user.bestfriends}:*"],
      action: "read",
    },
  ]);
  expect(role.can("read", "secrets:123:sshhh", { user: { id: 123 } })).toBe(
    true
  );
  expect(role.can("write", "secrets:123:sshhh", { user: { id: 123 } })).toBe(
    true
  );
  expect(role.can("read", "secrets:123:sshhh", { user: { id: 456 } })).toBe(
    false
  );
  expect(
    role.can("read", "secrets:563:sshhh", {
      user: { id: 456, bestfriends: [123, 563, 1211] },
    })
  ).toBe(true);
  expect(role.can("write", "secrets:123:sshhh")).toBe(false);
});

it("can match based on conditions", () => {
  const conditions = {
    greatherThan: (data: number, expected: number) => {
      return data > expected;
    },
  };

  const role = new Role(
    [
      {
        resource: "secrets:*",
        action: ["read", "write"],
      },
      {
        resource: ["posts:${user.id}:*"],
        action: ["write", "read", "update"],
        condition: {
          greatherThan: {
            "user.age": 18,
          },
        },
      },
    ],
    conditions
  );

  expect(role.can("read", "secrets:123:sshhh", { user: { id: 123 } })).toBe(
    true
  );
  expect(
    role.can("write", "posts:123:sshhh", { user: { id: 123, age: 17 } })
  ).toBe(false);
  expect(
    role.can("read", "posts:456:sshhh", { user: { id: 456, age: 19 } })
  ).toBe(true);
});
