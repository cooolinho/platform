import Vue from 'vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import 'src/module/sw-users-permissions/components/sw-users-permissions-permissions-grid';
import 'src/app/component/form/sw-checkbox-field';
import PrivilegesService from 'src/app/service/privileges.service';

function createWrapper({ privilegesMappings = [], rolePrivileges = [] } = {}) {
    const localVue = createLocalVue();
    localVue.directive('tooltip', {});

    const privilegesService = new PrivilegesService();
    privilegesMappings.forEach(mapping => {
        privilegesService.addPrivilegeMappingEntry(mapping);
    });

    return shallowMount(Shopware.Component.build('sw-users-permissions-permissions-grid'), {
        localVue,
        stubs: {
            'sw-card': true,
            'sw-checkbox-field': Shopware.Component.build('sw-checkbox-field'),
            'sw-icon': true,
            'sw-field-error': true,
            'sw-base-field': true
        },
        provide: {
            privileges: privilegesService
        },
        mocks: {
            $tc: t => t
        },
        propsData: Vue.observable({
            role: { privileges: rolePrivileges }
        })
    });
}

describe('src/module/sw-users-permissions/components/sw-users-permissions-permissions-grid', () => {
    it('should be a Vue.js component', () => {
        const wrapper = createWrapper();
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('should show the header with all titles', () => {
        const wrapper = createWrapper();

        const gridHeader = wrapper.find('.sw-users-permissions-permissions-grid__entry-header');
        const gridTitle = gridHeader.find('.sw-users-permissions-permissions-grid__title');
        const gridRoleViewer = gridHeader.findAll('.sw-users-permissions-permissions-grid__checkbox-wrapper').at(0);
        const gridRoleEditor = gridHeader.findAll('.sw-users-permissions-permissions-grid__checkbox-wrapper').at(1);
        const gridRoleCreator = gridHeader.findAll('.sw-users-permissions-permissions-grid__checkbox-wrapper').at(2);
        const gridRoleDeleter = gridHeader.findAll('.sw-users-permissions-permissions-grid__checkbox-wrapper').at(3);
        const gridRoleAll = gridHeader.find('.sw-users-permissions-permissions-grid__all');

        expect(gridHeader.exists()).toBeTruthy();

        expect(gridTitle.exists()).toBeTruthy();
        expect(gridTitle.text()).toBe('');

        expect(gridRoleViewer.exists()).toBeTruthy();
        expect(gridRoleViewer.text()).toBe('sw-privileges.roles.viewer');

        expect(gridRoleEditor.exists()).toBeTruthy();
        expect(gridRoleEditor.text()).toBe('sw-privileges.roles.editor');

        expect(gridRoleCreator.exists()).toBeTruthy();
        expect(gridRoleCreator.text()).toBe('sw-privileges.roles.creator');

        expect(gridRoleDeleter.exists()).toBeTruthy();
        expect(gridRoleDeleter.text()).toBe('sw-privileges.roles.deleter');

        expect(gridRoleAll.exists()).toBeTruthy();
        expect(gridRoleAll.text()).toBe('sw-privileges.roles.all');
    });

    it('should show a row with privileges', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const entry = wrapper.find('[class*=sw-users-permissions-permissions-grid__entry_');
        expect(entry.exists()).toBeTruthy();

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');

        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');
        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all .sw-field--checkbox');

        expect(productRow.exists()).toBeTruthy();
        expect(productViewer.exists()).toBeTruthy();
        expect(productEditor.exists()).toBeTruthy();
        expect(productCreator.exists()).toBeTruthy();
        expect(productDeleter.exists()).toBeTruthy();
        expect(productAll.exists()).toBeTruthy();
    });

    it('should show only privileges with the right category', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');

        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');
        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all .sw-field--checkbox');

        expect(productRow.exists()).toBeTruthy();
        expect(productViewer.exists()).toBeTruthy();
        expect(productEditor.exists()).toBeFalsy();
        expect(productCreator.exists()).toBeFalsy();
        expect(productDeleter.exists()).toBeTruthy();
        expect(productAll.exists()).toBeTruthy();
    });

    it('should show only roles which are existing', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'category',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');

        expect(productRow.exists()).toBeFalsy();
    });

    it('should ignore role which doesn´t fit in the category', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'additional_permissions',
                    key: 'system',
                    parent: null,
                    roles: {
                        clear_cache: {
                            dependencies: [],
                            privileges: ['system:clear:cache']
                        },
                        core_update: {
                            dependencies: [],
                            privileges: ['system:core:update']
                        },
                        plugin_maintain: {
                            dependencies: [],
                            privileges: ['system:plugin:maintain']
                        }
                    }
                }
            ]
        });

        const entry = wrapper.find('[class*=sw-users-permissions-permissions-grid__entry_');
        expect(entry.exists()).toBeFalsy();
    });

    it('should select the viewer role', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer');

        expect(wrapper.vm.role.privileges.length).toBe(0);

        productViewer.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges.length).toBe(1);
        expect(wrapper.vm.role.privileges[0]).toBe('product.viewer');
        expect(productViewer.find('.sw-field--checkbox').props().value).toBe(true);
    });

    it('should select the creator role', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator');

        expect(wrapper.vm.role.privileges.length).toBe(0);

        productCreator.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges.length).toBeGreaterThan(0);
        expect(wrapper.vm.role.privileges).toContain('product.creator');
        expect(productCreator.find('.sw-field--checkbox').props().value).toBe(true);
    });

    it('should select a role and all its dependencies in the same row', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer');

        expect(wrapper.vm.role.privileges.length).toBe(0);

        productCreator.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges.length).toBe(3);

        expect(wrapper.vm.role.privileges).toContain('product.creator');
        expect(wrapper.vm.role.privileges).toContain('product.editor');
        expect(wrapper.vm.role.privileges).toContain('product.viewer');

        expect(productViewer.find('.sw-field--checkbox').props().value).toBe(true);
        expect(productEditor.find('.sw-field--checkbox').props().value).toBe(true);
        expect(productCreator.find('.sw-field--checkbox').props().value).toBe(true);
    });

    it('should have enabled checkboxes when selecting a role with its dependencies', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');

        expect(productCreator.props().value).toBe(false);
        expect(productEditor.props().value).toBe(false);
        expect(productViewer.props().value).toBe(false);

        productCreator.find('.sw-field--checkbox input').trigger('click');

        wrapper.vm.$forceUpdate();

        expect(productCreator.props().value).toBe(true);
        expect(productEditor.props().value).toBe(true);
        expect(productViewer.props().value).toBe(true);
    });

    it('should select a role and all its dependencies in other rows', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'category',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_category');
        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryCreator = categoryRow.find('.sw-users-permissions-permissions-grid__role_creator');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        expect(wrapper.vm.role.privileges.length).toBe(0);

        categoryCreator.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges.length).toBe(3);

        expect(wrapper.vm.role.privileges).toContain('category.creator');
        expect(wrapper.vm.role.privileges).toContain('product.editor');
        expect(wrapper.vm.role.privileges).toContain('product.viewer');

        expect(categoryCreator.find('.sw-field--checkbox').props().value).toBe(true);
        expect(productViewer.find('.sw-field--checkbox').props().value).toBe(true);
        expect(productEditor.find('.sw-field--checkbox').props().value).toBe(true);
    });

    it('should select a role and add it to the role privileges prop', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator');

        productCreator.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges).toContain('product.creator');
    });

    it('should select a role and all dependencies to the role privileges prop', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator');

        productCreator.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges).toContain('product.creator');
        expect(wrapper.vm.role.privileges).toContain('product.editor');
        expect(wrapper.vm.role.privileges).toContain('product.viewer');
    });

    it('should select all and all roles in the row should be selected', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        expect(wrapper.vm.role.privileges).not.toContain('product.viewer');
        expect(wrapper.vm.role.privileges).not.toContain('product.editor');
        expect(wrapper.vm.role.privileges).not.toContain('product.creator');
        expect(wrapper.vm.role.privileges).not.toContain('product.deleter');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all');

        productAll.find('.sw-field--checkbox input').trigger('click');

        expect(wrapper.vm.role.privileges).toContain('product.viewer');
        expect(wrapper.vm.role.privileges).toContain('product.editor');
        expect(wrapper.vm.role.privileges).toContain('product.creator');
        expect(wrapper.vm.role.privileges).toContain('product.deleter');
    });

    it('should select all and all checkboxes in the row should be selected', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');
        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all');

        expect(productViewer.props().value).toBe(false);
        expect(productEditor.props().value).toBe(false);
        expect(productCreator.props().value).toBe(false);
        expect(productDeleter.props().value).toBe(false);

        productAll.find('.sw-field--checkbox input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(true);
        expect(productEditor.props().value).toBe(true);
        expect(productCreator.props().value).toBe(true);
        expect(productDeleter.props().value).toBe(true);
    });
    it('should select all and roles in other rows should not be selected', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'category',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_category');
        const categoryViewer = categoryRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const categoryEditor = categoryRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryCreator = categoryRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const categoryDeleter = categoryRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all');

        expect(productViewer.props().value).toBe(false);
        expect(productEditor.props().value).toBe(false);
        expect(productCreator.props().value).toBe(false);
        expect(productDeleter.props().value).toBe(false);

        expect(categoryViewer.props().value).toBe(false);
        expect(categoryEditor.props().value).toBe(false);
        expect(categoryCreator.props().value).toBe(false);
        expect(categoryDeleter.props().value).toBe(false);

        productAll.find('.sw-field--checkbox input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(true);
        expect(productEditor.props().value).toBe(true);
        expect(productCreator.props().value).toBe(true);
        expect(productDeleter.props().value).toBe(true);

        expect(categoryViewer.props().value).toBe(false);
        expect(categoryEditor.props().value).toBe(false);
        expect(categoryCreator.props().value).toBe(false);
        expect(categoryDeleter.props().value).toBe(false);
    });

    it('should select some and click on all. All have to be selected', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all');

        productViewer.find('.sw-field--checkbox input').trigger('click');
        productCreator.find('.sw-field--checkbox input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(true);
        expect(productEditor.props().value).toBe(false);
        expect(productCreator.props().value).toBe(true);
        expect(productDeleter.props().value).toBe(false);

        productAll.find('.sw-field--checkbox input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(true);
        expect(productEditor.props().value).toBe(true);
        expect(productCreator.props().value).toBe(true);
        expect(productDeleter.props().value).toBe(true);
    });
    it('should select all roles each and the checkbox all have to be checked', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all .sw-field--checkbox');

        expect(productAll.props().value).toBe(false);

        productViewer.find('.sw-field--checkbox input').trigger('click');
        productEditor.find('.sw-field--checkbox input').trigger('click');
        productCreator.find('.sw-field--checkbox input').trigger('click');
        productDeleter.find('.sw-field--checkbox input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productAll.props().value).toBe(true);
    });

    it('should unselect all roles with the checkbox all', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [],
                            privileges: []
                        },
                        creator: {
                            dependencies: [],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        const productAll = productRow.find('.sw-users-permissions-permissions-grid__all .sw-field--checkbox');

        productViewer.find('input').trigger('click');
        productEditor.find('input').trigger('click');
        productCreator.find('input').trigger('click');
        productDeleter.find('input').trigger('click');

        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(true);
        expect(productEditor.props().value).toBe(true);
        expect(productCreator.props().value).toBe(true);
        expect(productDeleter.props().value).toBe(true);

        productAll.find('input').trigger('click');
        wrapper.vm.$forceUpdate();

        expect(productViewer.props().value).toBe(false);
        expect(productEditor.props().value).toBe(false);
        expect(productCreator.props().value).toBe(false);
        expect(productDeleter.props().value).toBe(false);
    });

    it('should disable checkboxes which are dependencies for viewer (0 dependencies)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        productViewer.find('input').trigger('click');

        expect(productViewer.props().value).toBe(true);
        expect(productViewer.props().disabled).toBe(false);

        expect(productEditor.props().value).toBe(false);
        expect(productEditor.props().disabled).toBe(false);

        expect(productCreator.props().value).toBe(false);
        expect(productCreator.props().disabled).toBe(false);

        expect(productDeleter.props().value).toBe(false);
        expect(productDeleter.props().disabled).toBe(false);
    });

    it('should disable checkboxes which are dependencies for editor (1 dependency)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        productEditor.find('input').trigger('click');

        expect(productViewer.props().value).toBe(true);
        expect(productViewer.props().disabled).toBe(true);

        expect(productEditor.props().value).toBe(true);
        expect(productEditor.props().disabled).toBe(false);

        expect(productCreator.props().value).toBe(false);
        expect(productCreator.props().disabled).toBe(false);

        expect(productDeleter.props().value).toBe(false);
        expect(productDeleter.props().disabled).toBe(false);
    });

    it('should disable checkboxes which are dependencies for creator (2 dependencies)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        productCreator.find('input').trigger('click');

        expect(productViewer.props().value).toBe(true);
        expect(productViewer.props().disabled).toBe(true);

        expect(productEditor.props().value).toBe(true);
        expect(productEditor.props().disabled).toBe(true);

        expect(productCreator.props().value).toBe(true);
        expect(productCreator.props().disabled).toBe(false);

        expect(productDeleter.props().value).toBe(false);
        expect(productDeleter.props().disabled).toBe(false);
    });

    it('should disable checkboxes which are dependencies for deleter (1 dependency)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productViewer = productRow.find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditor = productRow.find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const productCreator = productRow.find('.sw-users-permissions-permissions-grid__role_creator .sw-field--checkbox');
        const productDeleter = productRow.find('.sw-users-permissions-permissions-grid__role_deleter .sw-field--checkbox');

        productDeleter.find('input').trigger('click');

        expect(productViewer.props().value).toBe(true);
        expect(productViewer.props().disabled).toBe(true);

        expect(productEditor.props().value).toBe(false);
        expect(productEditor.props().disabled).toBe(false);

        expect(productCreator.props().value).toBe(false);
        expect(productCreator.props().disabled).toBe(false);

        expect(productDeleter.props().value).toBe(true);
        expect(productDeleter.props().disabled).toBe(false);
    });

    it('should show the parent permissions', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['product.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['product.viewer', 'product.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['product.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const parentGrids = wrapper.findAll('.sw-users-permissions-permissions-grid__parent');
        expect(parentGrids.length).toBe(3);

        const parentCatalogues = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const parentNull = wrapper.find('.sw-users-permissions-permissions-grid__parent_null');
        const parentSettings = wrapper.find('.sw-users-permissions-permissions-grid__parent_settings');

        expect(parentCatalogues.isVisible()).toBeTruthy();
        expect(parentNull.isVisible()).toBeTruthy();
        expect(parentSettings.isVisible()).toBeTruthy();
    });

    it('should organize the children to the matching parents', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['product.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['product.viewer', 'product.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['product.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const gridEntries = wrapper.findAll('.sw-users-permissions-permissions-grid__entry');
        expect(gridEntries.length).toBe(8);

        // header in beginning
        expect(gridEntries.at(0).classes()).toContain('sw-users-permissions-permissions-grid__entry-header');

        // catalogues with children
        expect(gridEntries.at(1).classes()).toContain('sw-users-permissions-permissions-grid__parent_catalogues');
        expect(gridEntries.at(2).classes()).toContain('sw-users-permissions-permissions-grid__entry_categories');
        expect(gridEntries.at(3).classes()).toContain('sw-users-permissions-permissions-grid__entry_product');

        // other (null) with children
        expect(gridEntries.at(4).classes()).toContain('sw-users-permissions-permissions-grid__parent_null');
        expect(gridEntries.at(5).classes()).toContain('sw-users-permissions-permissions-grid__entry_sales_channel');

        // settings with children
        expect(gridEntries.at(6).classes()).toContain('sw-users-permissions-permissions-grid__parent_settings');
        expect(gridEntries.at(7).classes()).toContain('sw-users-permissions-permissions-grid__entry_currencies');
    });

    it('should sort parents alphabetically with the label', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'orders',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: 'content',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {}
                }
            ]
        });

        const gridEntries = wrapper.findAll('.sw-users-permissions-permissions-grid__entry');
        expect(gridEntries.length).toBe(9);

        // check if order is sorted alphabetically
        expect(gridEntries.at(1).classes()).toContain('sw-users-permissions-permissions-grid__parent_catalogues');
        expect(gridEntries.at(3).classes()).toContain('sw-users-permissions-permissions-grid__parent_content');
        expect(gridEntries.at(5).classes()).toContain('sw-users-permissions-permissions-grid__parent_orders');
        expect(gridEntries.at(7).classes()).toContain('sw-users-permissions-permissions-grid__parent_settings');
    });

    it('should sort children in parents alphabetically', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'rule_builder',
                    parent: 'settings',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'basic_information',
                    parent: 'settings',
                    roles: {}
                },
                {
                    category: 'permissions',
                    key: 'documents',
                    parent: 'settings',
                    roles: {}
                }
            ]
        });

        const gridEntries = wrapper.findAll('.sw-users-permissions-permissions-grid__entry');
        expect(gridEntries.length).toBe(6);

        // check if order is sorted alphabetically
        expect(gridEntries.at(2).classes()).toContain('sw-users-permissions-permissions-grid__entry_basic_information');
        expect(gridEntries.at(3).classes()).toContain('sw-users-permissions-permissions-grid__entry_currencies');
        expect(gridEntries.at(4).classes()).toContain('sw-users-permissions-permissions-grid__entry_documents');
        expect(gridEntries.at(5).classes()).toContain('sw-users-permissions-permissions-grid__entry_rule_builder');
    });

    it('parent checkbox should be ghost checked when some of the child permission is clicked (TODO)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueViewerCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const catalogueEditorCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        expect(catalogueViewerCheckbox.props().ghostValue).toBe(false);
        expect(catalogueEditorCheckbox.props().ghostValue).toBe(false);

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        productEditorCheckbox.find('input').trigger('click');

        expect(catalogueViewerCheckbox.props().ghostValue).toBe(true);
        expect(catalogueEditorCheckbox.props().ghostValue).toBe(true);
    });

    it('parent checkbox should be ghost checked when some of the child permission is clicked (all)', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueAllCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_all .sw-field--checkbox');

        expect(catalogueAllCheckbox.props().ghostValue).toBe(false);

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const productAllCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_all .sw-field--checkbox');

        productAllCheckbox.find('input').trigger('click');

        expect(catalogueAllCheckbox.props().ghostValue).toBe(true);
    });

    it('parent checkbox should be checked when all of the child permission is clicked', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueEditorCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        expect(catalogueEditorCheckbox.props().value).toBe(false);
        expect(productEditorCheckbox.props().value).toBe(false);
        expect(categoryEditorCheckbox.props().value).toBe(false);

        productEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(false);

        categoryEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(true);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryEditorCheckbox.props().value).toBe(true);
    });

    it('parent checkbox should be disabled when all of the child permission are disabled', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueViewerCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        expect(catalogueViewerCheckbox.props().disabled).toBe(false);

        productEditorCheckbox.find('input').trigger('click');

        expect(catalogueViewerCheckbox.props().disabled).toBe(false);

        categoryEditorCheckbox.find('input').trigger('click');

        expect(catalogueViewerCheckbox.props().disabled).toBe(true);
    });

    it('parent checkbox should check all of the child permission when clicked', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueEditorCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        expect(catalogueEditorCheckbox.props().value).toBe(false);
        expect(productEditorCheckbox.props().value).toBe(false);
        expect(categoryEditorCheckbox.props().value).toBe(false);

        catalogueEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(true);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryEditorCheckbox.props().value).toBe(true);
    });

    // eslint-disable-next-line max-len
    it('parent checkbox should check all of the child permission when clicked and some child permissions are already clicked', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueEditorCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        productEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(false);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryEditorCheckbox.props().value).toBe(false);

        catalogueEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(true);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryEditorCheckbox.props().value).toBe(true);
    });

    it('parent checkbox should uncheck all of the child permission when unchecked', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueEditorCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');

        productEditorCheckbox.find('input').trigger('click');
        categoryEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(true);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryEditorCheckbox.props().value).toBe(true);

        catalogueEditorCheckbox.find('input').trigger('click');

        expect(catalogueEditorCheckbox.props().value).toBe(false);
        expect(productEditorCheckbox.props().value).toBe(false);
        expect(categoryEditorCheckbox.props().value).toBe(false);
    });

    it('parent checkbox should uncheck all of the child permission when unchecked expect disabled checkboxes', () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const cataloguesRow = wrapper.find('.sw-users-permissions-permissions-grid__parent_catalogues');
        const catalogueViewerCheckbox = cataloguesRow
            .find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');

        const productRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_product');
        const categoryRow = wrapper.find('.sw-users-permissions-permissions-grid__entry_categories');
        const productViewerCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');
        const productEditorCheckbox = productRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryEditorCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_editor .sw-field--checkbox');
        const categoryViewerCheckbox = categoryRow
            .find('.sw-users-permissions-permissions-grid__role_viewer .sw-field--checkbox');

        // check product.editor
        productEditorCheckbox.find('input').trigger('click');

        expect(catalogueViewerCheckbox.props().value).toBe(false);
        expect(productViewerCheckbox.props().value).toBe(true);
        expect(productEditorCheckbox.props().value).toBe(true);
        expect(categoryViewerCheckbox.props().value).toBe(false);
        expect(categoryEditorCheckbox.props().value).toBe(false);

        // check all catalogues viewer children
        categoryViewerCheckbox.find('input').trigger('click');

        expect(catalogueViewerCheckbox.props().value).toBe(true);
        expect(productViewerCheckbox.props().value).toBe(true);
        expect(categoryViewerCheckbox.props().value).toBe(true);

        // uncheck all catalogues viewer children
        catalogueViewerCheckbox.find('input').trigger('click');

        expect(productViewerCheckbox.props().value).toBe(true);
        expect(categoryViewerCheckbox.props().value).toBe(false);
    });

    it('should disable all checkboxes', async () => {
        const wrapper = createWrapper({
            privilegesMappings: [
                {
                    category: 'permissions',
                    key: 'product',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        },
                        creator: {
                            dependencies: [
                                'product.viewer',
                                'product.editor'
                            ],
                            privileges: []
                        },
                        deleter: {
                            dependencies: [
                                'product.viewer'
                            ],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'categories',
                    parent: 'catalogues',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['categories.viewer', 'categories.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['categories.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'currencies',
                    parent: 'settings',
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['currencies.viewer', 'currencies.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['currencies.viewer'],
                            privileges: []
                        }
                    }
                },
                {
                    category: 'permissions',
                    key: 'sales_channel',
                    parent: null,
                    roles: {
                        viewer: {
                            dependencies: [],
                            privileges: []
                        },
                        editor: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        },
                        creator: {
                            dependencies: ['sales_channel.viewer', 'sales_channel.editor'],
                            privileges: []
                        },
                        deleter: {
                            dependencies: ['sales_channel.viewer'],
                            privileges: []
                        }
                    }
                }
            ]
        });

        const checkboxes = wrapper.findAll('.sw-field--checkbox');

        checkboxes.wrappers.forEach(checkbox => {
            expect(checkbox.props().disabled).toBe(false);
        });

        wrapper.setProps({ disabled: true });

        checkboxes.wrappers.forEach(checkbox => {
            expect(checkbox.props().disabled).toBe(true);
        });
    });
});
