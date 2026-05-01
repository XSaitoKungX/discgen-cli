import { describe, it, expect } from 'vitest';
import { generateExampleButton, generateOpenModalButton } from '../templates/interactions/button.js';
import { generateExampleSelect } from '../templates/interactions/select.js';
import { generateExampleModal } from '../templates/interactions/modal.js';
import { generateDemoCommand } from '../templates/commands/demo.js';
import { generateButtonFile, generateSelectFile, generateModalFile } from '../templates/generate/interaction.js';

describe('generateExampleButton', () => {
  it('returns a non-empty string', () => {
    expect(generateExampleButton().length).toBeGreaterThan(0);
  });
  it('uses ButtonHandler type', () => {
    expect(generateExampleButton()).toContain('ButtonHandler');
  });
  it('has customId example_button', () => {
    expect(generateExampleButton()).toContain("customId: 'example_button'");
  });
});

describe('generateOpenModalButton', () => {
  it('returns a non-empty string', () => {
    expect(generateOpenModalButton().length).toBeGreaterThan(0);
  });
  it('shows a modal', () => {
    expect(generateOpenModalButton()).toContain('showModal');
  });
  it('uses ModalBuilder', () => {
    expect(generateOpenModalButton()).toContain('ModalBuilder');
  });
  it('has customId open_modal', () => {
    expect(generateOpenModalButton()).toContain("customId: 'open_modal'");
  });
});

describe('generateExampleSelect', () => {
  it('returns a non-empty string', () => {
    expect(generateExampleSelect().length).toBeGreaterThan(0);
  });
  it('uses SelectHandler type', () => {
    expect(generateExampleSelect()).toContain('SelectHandler');
  });
  it('uses AnySelectMenuInteraction', () => {
    expect(generateExampleSelect()).toContain('AnySelectMenuInteraction');
  });
  it('reads interaction values', () => {
    expect(generateExampleSelect()).toContain('interaction.values');
  });
});

describe('generateExampleModal', () => {
  it('returns a non-empty string', () => {
    expect(generateExampleModal().length).toBeGreaterThan(0);
  });
  it('uses ModalHandler type', () => {
    expect(generateExampleModal()).toContain('ModalHandler');
  });
  it('uses ModalSubmitInteraction', () => {
    expect(generateExampleModal()).toContain('ModalSubmitInteraction');
  });
  it('reads a text input value', () => {
    expect(generateExampleModal()).toContain('getTextInputValue');
  });
});

describe('generateDemoCommand', () => {
  it('returns a non-empty string', () => {
    expect(generateDemoCommand().length).toBeGreaterThan(0);
  });
  it('uses SlashCommandBuilder', () => {
    expect(generateDemoCommand()).toContain('SlashCommandBuilder');
  });
  it('uses Components v2 ContainerBuilder', () => {
    expect(generateDemoCommand()).toContain('ContainerBuilder');
  });
  it('includes a button row', () => {
    expect(generateDemoCommand()).toContain('ButtonBuilder');
  });
  it('includes a select menu row', () => {
    expect(generateDemoCommand()).toContain('StringSelectMenuBuilder');
  });
  it('uses IsComponentsV2 flag', () => {
    expect(generateDemoCommand()).toContain('IsComponentsV2');
  });
  it('sets command name to demo', () => {
    expect(generateDemoCommand()).toContain("setName('demo')");
  });
  it('satisfies Command type', () => {
    expect(generateDemoCommand()).toContain('satisfies Command');
  });
});

describe('generateButtonFile (generate subcommand)', () => {
  it('uses ButtonHandler type', () => {
    expect(generateButtonFile('click-me')).toContain('ButtonHandler');
  });
  it('converts kebab-case to underscore customId', () => {
    expect(generateButtonFile('click-me')).toContain("customId: 'click_me'");
  });
});

describe('generateSelectFile (generate subcommand)', () => {
  it('uses SelectHandler type', () => {
    expect(generateSelectFile('role-picker')).toContain('SelectHandler');
  });
  it('converts kebab-case to underscore customId', () => {
    expect(generateSelectFile('role-picker')).toContain("customId: 'role_picker'");
  });
});

describe('generateModalFile (generate subcommand)', () => {
  it('uses ModalHandler type', () => {
    expect(generateModalFile('feedback')).toContain('ModalHandler');
  });
  it('uses correct customId', () => {
    expect(generateModalFile('feedback')).toContain("customId: 'feedback'");
  });
});
