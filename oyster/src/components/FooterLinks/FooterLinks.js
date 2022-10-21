import { createStyles, Container, Group, Anchor, Text } from '@mantine/core';
// import { MantineLogo } from '@mantine/ds';

// import { Logo } from '../Logo/logo';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function FooterLinks({links}) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor
      color="dimmed"
      key={link.label}
      href={link.link}
      target="_blank"
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        {/* <MantineLogo size={28} /> */}
        <Text
            align="center"
            size="20px"
            weight={700}
          >まどりーだー</Text>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
